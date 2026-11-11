'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import CanvasErrorBoundary from '@/components/three/CanvasErrorBoundary';
import {
  NOISE_GLSL,
  createLabelTexture,
  createLineGeometry,
  createLineMaterial,
  createMeteorMaterial,
  createStarGeometry,
  createStarMaterial,
  randomDirection,
  sequentialSegments,
  sphereProjector,
  srgb,
  type SkyPlacement,
  type StarPoint,
} from '@/components/three/materials';
import { CONSTELLATIONS, type ConstellationId } from '@/lib/constellations';
import { hasWebGL2 } from '@/lib/webgl';

/* ───────────────────────────────────────────────────────────────
 * Global celestial sphere: baked nebula dome, twinkling star field,
 * real constellations that trace themselves when they turn into
 * view, shooting stars and scroll/mouse-driven parallax.
 * ─────────────────────────────────────────────────────────────── */

const SKY_RADIUS = 24;
const REVEAL_DOT = 0.78; // ~39° from the view direction

const SKY_LAYOUT: ReadonlyArray<SkyPlacement & { id: ConstellationId; color: string }> = [
  { id: 'draco', az: -30, el: 16, rot: -0.12, scale: 0.068, color: '#fdba74' },
  { id: 'orion', az: 30, el: -9, rot: 0.1, scale: 0.075, color: '#c4b5fd' },
  { id: 'cassiopeia', az: 88, el: 20, rot: 0.25, scale: 0.075, color: '#d8b4fe' },
  { id: 'ursaMajor', az: 145, el: 6, rot: -0.2, scale: 0.07, color: '#c4b5fd' },
  { id: 'cygnus', az: 205, el: -4, rot: 0.35, scale: 0.075, color: '#a5b4fc' },
  { id: 'scorpius', az: 258, el: -14, rot: 0.15, scale: 0.07, color: '#f9a8d4' },
  { id: 'lyra', az: 310, el: 18, rot: 0, scale: 0.1, color: '#c4b5fd' },
];

/* ─── Nebula (baked once into an equirectangular texture) ─────── */

const BAKE_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const BAKE_FRAGMENT = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uViolet;
  uniform vec3 uIndigo;
  uniform vec3 uEmber;
  uniform vec3 uRose;
  varying vec2 vUv;
  ${NOISE_GLSL}

  void main() {
    float lon = (vUv.x - 0.5) * 6.28318530718;
    float lat = (vUv.y - 0.5) * 3.14159265359;
    vec3 d = vec3(cos(lat) * sin(lon), sin(lat), -cos(lat) * cos(lon));
    vec3 p = d * 1.9;

    vec3 q = vec3(fbm(p), fbm(p + vec3(5.2, 1.3, 2.8)), fbm(p + vec3(1.7, 9.2, 4.1)));
    float n = fbm(p * 1.3 + q * 2.2);
    float wisps = fbm(p * 3.4 + q * 1.4);

    // A faint galactic band along a tilted great circle
    float band = pow(1.0 - abs(dot(d, normalize(vec3(0.3, 1.0, 0.25)))), 5.0);

    float clouds = smoothstep(0.38, 0.85, n);
    float fine = smoothstep(0.52, 0.9, wisps);

    vec3 col = mix(uDeep, uViolet, clouds);
    col = mix(col, uIndigo, smoothstep(0.4, 0.8, q.y) * 0.55);
    col += uEmber * fine * smoothstep(0.45, 0.75, q.x) * 0.5;
    col += uRose * band * clouds * 0.35;

    float alpha = clamp(clouds * 0.4 + band * 0.2 + fine * 0.1, 0.0, 0.7);
    gl_FragColor = vec4(col, alpha);
  }
`;

const DOME_VERTEX = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const DOME_FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec3 vDir;

  void main() {
    vec3 d = normalize(vDir);
    vec2 uv = vec2(atan(d.x, -d.z) / 6.28318530718 + 0.5, asin(clamp(d.y, -1.0, 1.0)) / 3.14159265359 + 0.5);
    vec4 tex = texture2D(uMap, uv);
    float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
    gl_FragColor = vec4(tex.rgb + dither, tex.a * uOpacity);
  }
`;

function bakeNebula(gl: THREE.WebGLRenderer, width: number) {
  const target = new THREE.WebGLRenderTarget(width, width / 2, { depthBuffer: false });
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uDeep: { value: srgb('#1a0836') },
      uViolet: { value: srgb('#5b21b6') },
      uIndigo: { value: srgb('#312e81') },
      uEmber: { value: srgb('#c2410c') },
      uRose: { value: srgb('#9d174d') },
    },
    vertexShader: BAKE_VERTEX,
    fragmentShader: BAKE_FRAGMENT,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);

  const previous = gl.getRenderTarget();
  gl.setRenderTarget(target);
  gl.render(scene, camera);
  gl.setRenderTarget(previous);

  quad.geometry.dispose();
  material.dispose();
  return target;
}

function NebulaDome({ mobile }: { mobile: boolean }) {
  const gl = useThree((s) => s.gl);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const fade = useRef(0);

  useEffect(() => {
    const target = bakeNebula(gl, mobile ? 1024 : 2048);
    setTexture(target.texture);
    return () => target.dispose();
  }, [gl, mobile]);

  const material = useMemo(
    () =>
      texture
        ? new THREE.ShaderMaterial({
            uniforms: { uMap: { value: texture }, uOpacity: { value: 0 } },
            vertexShader: DOME_VERTEX,
            fragmentShader: DOME_FRAGMENT,
            side: THREE.BackSide,
            transparent: true,
            depthWrite: false,
          })
        : null,
    [texture]
  );
  useEffect(() => () => material?.dispose(), [material]);

  useFrame((_, delta) => {
    if (!material || fade.current >= 1) return;
    fade.current = Math.min(1, fade.current + Math.min(delta, 0.1) * 0.5);
    material.uniforms.uOpacity.value = fade.current;
  });

  if (!material) return null;
  return (
    <mesh material={material} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[90, 48, 32]} />
    </mesh>
  );
}

/* ─── Field stars ────────────────────────────────────────────── */

function StarField({ count, reduced }: { count: number; reduced: boolean }) {
  const { geometry, material } = useMemo(() => {
    const palette = ['#ffffff', '#ece6ff', '#d8ccff', '#c4d4ff', '#ffe9d1', '#f5d0fe'].map(srgb);
    const bandNormal = new THREE.Vector3(0.3, 1, 0.25).normalize();
    const stars: StarPoint[] = [];
    for (let i = 0; i < count; i++) {
      const dir = randomDirection();
      // a third of the stars crowd around the galactic band
      if (i % 3 === 0) dir.addScaledVector(bandNormal, -dir.dot(bandNormal) * 0.88).normalize();
      const bright = Math.random() < 0.035;
      stars.push({
        position: dir.multiplyScalar(32 + Math.random() * 24),
        size: bright ? 3.4 + Math.random() * 2.2 : 0.9 + Math.pow(Math.random(), 3) * 2.2,
        color: palette[Math.floor(Math.random() * palette.length)],
        phase: Math.random(),
      });
    }
    return {
      geometry: createStarGeometry(stars),
      material: createStarMaterial({ size: 2.4, twinkle: 0.55, spikes: 0.8, opacity: 0.95 }),
    };
  }, [count]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );

  useFrame(({ clock, viewport }) => {
    if (!reduced) material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uPixelRatio.value = viewport.dpr;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/* ─── Constellations that trace themselves when in view ──────── */

function SkyConstellation({
  layout,
  reduced,
  labelFont,
}: {
  layout: (typeof SKY_LAYOUT)[number];
  reduced: boolean;
  labelFont: string | null;
}) {
  const anchor = useRef<THREE.Group>(null);
  const draw = useRef(reduced ? 1 : 0);
  const tmp = useMemo(() => ({ dir: new THREE.Vector3(), fwd: new THREE.Vector3() }), []);
  const shape = CONSTELLATIONS[layout.id];

  const scene = useMemo(() => {
    const project = sphereProjector(SKY_RADIUS, layout);
    const positions = shape.stars.map(([x, y]) => project(x, y));
    const xs = shape.stars.map((s) => s[0]);
    const ys = shape.stars.map((s) => s[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const tint = srgb(layout.color).lerp(srgb('#ffffff'), 0.55);

    const stars: StarPoint[] = shape.stars.map(([, , brightness], i) => ({
      position: positions[i],
      size: 3.2 * brightness,
      color: tint,
      phase: (i * 0.618) % 1,
    }));

    return {
      lineGeometry: createLineGeometry(
        sequentialSegments(shape.lines.map(([a, b]) => [positions[a], positions[b]] as const))
      ),
      lineMaterial: createLineMaterial({
        color: layout.color,
        width: 2,
        opacity: 0.6,
        count: shape.lines.length,
        draw: 0,
        shimmer: 0.35,
      }),
      starGeometry: createStarGeometry(stars),
      starMaterial: createStarMaterial({ size: 3.2, twinkle: 0.3, spikes: 1, opacity: 0.4 }),
      center: project(cx, cy).normalize(),
      labelPosition: project(cx, Math.min(...ys) - 0.9),
    };
  }, [layout, shape]);

  const label = useMemo(() => {
    if (!labelFont) return null;
    const result = createLabelTexture(shape.name, labelFont);
    if (!result) return null;
    const material = new THREE.SpriteMaterial({
      map: result.texture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    return { material, aspect: result.aspect, texture: result.texture };
  }, [labelFont, shape.name]);

  useEffect(
    () => () => {
      scene.lineGeometry.dispose();
      scene.lineMaterial.dispose();
      scene.starGeometry.dispose();
      scene.starMaterial.dispose();
    },
    [scene]
  );

  useEffect(
    () => () => {
      label?.texture.dispose();
      label?.material.dispose();
    },
    [label]
  );

  useFrame(({ camera, clock, size, viewport }, delta) => {
    const group = anchor.current;
    if (!group) return;

    tmp.dir.copy(scene.center).transformDirection(group.matrixWorld);
    camera.getWorldDirection(tmp.fwd);
    const target = reduced || tmp.dir.dot(tmp.fwd) > REVEAL_DOT ? 1 : 0;
    const rate = target > draw.current ? 0.3 : 0.55;
    draw.current = THREE.MathUtils.clamp(
      draw.current + Math.sign(target - draw.current) * rate * Math.min(delta, 0.1),
      0,
      1
    );
    const eased = draw.current * draw.current * (3 - 2 * draw.current);

    const { lineMaterial, starMaterial } = scene;
    lineMaterial.uniforms.uDraw.value = eased;
    lineMaterial.uniforms.uResolution.value.set(size.width, size.height);
    starMaterial.uniforms.uPixelRatio.value = viewport.dpr;
    starMaterial.uniforms.uOpacity.value = 0.4 + 0.6 * eased;
    if (!reduced) {
      lineMaterial.uniforms.uTime.value = clock.elapsedTime;
      starMaterial.uniforms.uTime.value = clock.elapsedTime;
    }
    if (label) label.material.opacity = eased * 0.75;
  });

  return (
    <group ref={anchor}>
      <mesh geometry={scene.lineGeometry} material={scene.lineMaterial} frustumCulled={false} />
      <points geometry={scene.starGeometry} material={scene.starMaterial} frustumCulled={false} />
      {label && (
        <sprite material={label.material} position={scene.labelPosition} scale={[0.7 * label.aspect, 0.7, 1]} />
      )}
    </group>
  );
}

/* ─── Close dust for depth parallax ──────────────────────────── */

function NearDust({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const palette = ['#c084fc', '#a78bfa', '#f0abfc', '#fdba74', '#ffffff'].map(srgb);
    const stars: StarPoint[] = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        position: randomDirection().multiplyScalar(5 + Math.random() * 11),
        size: 0.8 + Math.random() * 1.6,
        color: palette[i % palette.length],
        phase: Math.random(),
      });
    }
    return {
      geometry: createStarGeometry(stars),
      material: createStarMaterial({ size: 2, twinkle: 0.6, attenuation: 7, opacity: 0.55 }),
    };
  }, [count]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );

  useFrame(({ clock, viewport }) => {
    material.uniforms.uPixelRatio.value = viewport.dpr;
    if (reduced || !ref.current) return;
    const t = clock.elapsedTime;
    material.uniforms.uTime.value = t;
    ref.current.rotation.y = t * 0.012;
    ref.current.rotation.x = Math.sin(t * 0.05) * 0.05;
  });

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />;
}

/* ─── Shooting star ──────────────────────────────────────────── */

function ShootingStar() {
  const { geometry, material } = useMemo(
    () => ({
      geometry: createLineGeometry([{ a: new THREE.Vector3(), b: new THREE.Vector3(0, 0, -1), seq: 0 }]),
      material: createMeteorMaterial('#f5e8ff'),
    }),
    []
  );

  const meteor = useRef({
    active: false,
    start: 0,
    duration: 1,
    next: 3 + Math.random() * 4,
    length: 8,
    origin: new THREE.Vector3(),
    dir: new THREE.Vector3(),
  });
  const tmp = useMemo(
    () => ({
      fwd: new THREE.Vector3(),
      right: new THREE.Vector3(),
      up: new THREE.Vector3(),
      head: new THREE.Vector3(),
      tail: new THREE.Vector3(),
    }),
    []
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );

  useFrame(({ clock, camera, size }) => {
    const t = clock.elapsedTime;
    const m = meteor.current;
    material.uniforms.uResolution.value.set(size.width, size.height);

    if (!m.active) {
      material.uniforms.uOpacity.value = 0;
      if (t < m.next) return;
      camera.getWorldDirection(tmp.fwd);
      tmp.right.crossVectors(tmp.fwd, camera.up).normalize();
      tmp.up.crossVectors(tmp.right, tmp.fwd).normalize();
      m.origin
        .copy(tmp.fwd)
        .addScaledVector(tmp.right, (Math.random() - 0.5) * 1.1)
        .addScaledVector(tmp.up, 0.05 + Math.random() * 0.4)
        .normalize()
        .multiplyScalar(20)
        .add(camera.position);
      const side = Math.random() < 0.5 ? -1 : 1;
      const slope = 0.25 + Math.random() * 0.45;
      m.dir
        .copy(tmp.right)
        .multiplyScalar(side * Math.cos(slope))
        .addScaledVector(tmp.up, -Math.sin(slope))
        .normalize();
      m.length = 6 + Math.random() * 6;
      m.duration = 0.9 + Math.random() * 0.7;
      m.start = t;
      m.active = true;
    }

    const p = (t - m.start) / m.duration;
    if (p >= 1) {
      m.active = false;
      m.next = t + 5 + Math.random() * 8;
      material.uniforms.uOpacity.value = 0;
      return;
    }

    const travel = m.length * (1 - Math.pow(1 - p, 2));
    tmp.head.copy(m.origin).addScaledVector(m.dir, travel);
    tmp.tail.copy(tmp.head).addScaledVector(m.dir, -Math.min(travel, 3.2) * (1 - p * 0.5));

    const start = geometry.attributes.position as THREE.BufferAttribute;
    const end = geometry.attributes.aEnd as THREE.BufferAttribute;
    for (let i = 0; i < 4; i++) {
      start.setXYZ(i, tmp.tail.x, tmp.tail.y, tmp.tail.z);
      end.setXYZ(i, tmp.head.x, tmp.head.y, tmp.head.z);
    }
    start.needsUpdate = true;
    end.needsUpdate = true;
    material.uniforms.uOpacity.value = Math.sin(Math.PI * p) * 0.9;
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}

/* ─── Scene root: scroll turns the sky, the mouse tilts the view ─ */

function Sky({ reduced, mobile, labelFont }: { reduced: boolean; mobile: boolean; labelFont: string | null }) {
  const sky = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  useFrame(({ camera, clock }, delta) => {
    const group = sky.current;
    if (!group) return;
    const dt = Math.min(delta, 0.1);

    if (!reduced) {
      scroll.current += (window.scrollY - scroll.current) * Math.min(1, dt * 2.5);
      group.rotation.y = scroll.current * 0.0006 + clock.elapsedTime * 0.005;
      group.rotation.x = Math.sin(scroll.current * 0.00035) * 0.12;
    }

    const { x, y } = mouse.current;
    camera.position.x += (x * 0.45 - camera.position.x) * Math.min(1, dt * 2);
    camera.position.y += (-y * 0.3 - camera.position.y) * Math.min(1, dt * 2);
    camera.lookAt(x * 0.9, -y * 0.6, -12);
  });

  return (
    <>
      <group ref={sky}>
        <NebulaDome mobile={mobile} />
        <StarField count={mobile ? 1100 : 2200} reduced={reduced} />
        {SKY_LAYOUT.map((layout) => (
          <SkyConstellation key={layout.id} layout={layout} reduced={reduced} labelFont={labelFont} />
        ))}
      </group>
      <NearDust count={mobile ? 70 : 160} reduced={reduced} />
      {!reduced && <ShootingStar />}
    </>
  );
}

export default function CosmicBackground() {
  const reduced = !!useReducedMotion();
  const [env, setEnv] = useState<{ supported: boolean; mobile: boolean } | null>(null);
  const [labelFont, setLabelFont] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEnv({ supported: hasWebGL2(), mobile: window.matchMedia('(max-width: 768px)').matches });

    let cancelled = false;
    const family = getComputedStyle(document.body).getPropertyValue('--font-cinzel').trim() || 'serif';
    const done = () => {
      if (!cancelled) setLabelFont(family);
    };
    if (document.fonts?.load) document.fonts.load(`600 40px ${family}`).then(done, done);
    else done();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!env?.supported) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-[2000ms] ease-out"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 0], fov: 60, near: 0.1, far: 200 }}
          dpr={[1, env.mobile ? 1.25 : 1.5]}
          gl={{ antialias: false, alpha: true, powerPreference: 'default' }}
          flat
          style={{ pointerEvents: 'none' }}
          onCreated={() => setReady(true)}
        >
          <Sky reduced={reduced} mobile={env.mobile} labelFont={labelFont} />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
