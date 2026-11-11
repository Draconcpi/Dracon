'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import CanvasErrorBoundary from '@/components/three/CanvasErrorBoundary';
import Astrolabe from '@/components/ui/Astrolabe';
import {
  NOISE_GLSL,
  arcPoints,
  createGlowTexture,
  createLineGeometry,
  createLineMaterial,
  createStarGeometry,
  createStarMaterial,
  randomDirection,
  sphereProjector,
  srgb,
  type LineSegmentDef,
  type SkyPlacement,
  type StarPoint,
} from '@/components/three/materials';
import { CONSTELLATIONS, type ConstellationId } from '@/lib/constellations';
import { hasWebGL2 } from '@/lib/webgl';

/* ───────────────────────────────────────────────────────────────
 * Hero centrepiece: a celestial globe with constellations traced
 * on its surface, a living star core and armillary rings.
 * ─────────────────────────────────────────────────────────────── */

const CAMERA_Z = 9.5;
const GLOBE_RADIUS = 1.5;

const GLOBE_LAYOUT: ReadonlyArray<SkyPlacement & { id: ConstellationId; color: string }> = [
  { id: 'draco', az: 0, el: 35, rot: 0.1, scale: 0.11, color: '#fdba74' },
  { id: 'orion', az: 140, el: -10, rot: 0, scale: 0.16, color: '#c4b5fd' },
  { id: 'cassiopeia', az: 250, el: 30, rot: 0.3, scale: 0.13, color: '#e9d5ff' },
  { id: 'scorpius', az: 60, el: -35, rot: -0.2, scale: 0.12, color: '#f9a8d4' },
  { id: 'cygnus', az: 300, el: -15, rot: 0.2, scale: 0.13, color: '#a5b4fc' },
];

interface RingConfig {
  radius: number;
  rotation: [number, number, number];
  speed: number;
  color: string;
  bead: string;
  width: number;
  opacity: number;
  ticks: boolean;
}

const RINGS: RingConfig[] = [
  { radius: 2.05, rotation: [0.38, 0, 0.41], speed: 0.22, color: '#fb923c', bead: '#fdba74', width: 1.6, opacity: 0.6, ticks: false },
  { radius: 2.32, rotation: [1.2, 0, -0.5], speed: -0.16, color: '#c4b5fd', bead: '#f5d0fe', width: 1.3, opacity: 0.45, ticks: false },
  { radius: 2.6, rotation: [0.75, 0.3, 0.9], speed: 0.1, color: '#a78bfa', bead: '#93c5fd', width: 1.1, opacity: 0.4, ticks: true },
];

/* ─── Core: a slowly boiling star ────────────────────────────── */

const CORE_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vPos = position;
    gl_Position = projectionMatrix * mv;
  }
`;

const CORE_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uHot;
  uniform vec3 uMid;
  uniform vec3 uRim;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  ${NOISE_GLSL}

  void main() {
    float facing = max(dot(normalize(vNormal), normalize(vView)), 0.0);
    float fres = pow(1.0 - facing, 1.8);
    vec3 p = vPos * 4.0 + vec3(0.0, uTime * 0.35, uTime * 0.18);
    float n = fbm(p + fbm(p * 1.7 - uTime * 0.1));
    vec3 col = mix(uHot, uMid, smoothstep(0.3, 0.75, n));
    col = mix(col, uRim, fres);
    col *= 0.85 + 0.5 * pow(facing, 3.0);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function OrbCore({ reduced, glow }: { reduced: boolean; glow: THREE.Texture }) {
  const inner = useRef<THREE.Sprite>(null);
  const outer = useRef<THREE.Sprite>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uHot: { value: srgb('#fff1dc') },
          uMid: { value: srgb('#f97316') },
          uRim: { value: srgb('#a855f4') },
        },
        vertexShader: CORE_VERTEX,
        fragmentShader: CORE_FRAGMENT,
      }),
    []
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    material.uniforms.uTime.value = t;
    const pulse = 1 + Math.sin(t * 1.2) * 0.06;
    inner.current?.scale.setScalar(2.1 * pulse);
    outer.current?.scale.setScalar(6.2 * (2 - pulse));
  });

  return (
    <group>
      <mesh material={material}>
        <sphereGeometry args={[0.42, 48, 48]} />
      </mesh>
      <sprite ref={inner} scale={2.1}>
        <spriteMaterial map={glow} color="#fdba74" transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite ref={outer} scale={6.2}>
        <spriteMaterial map={glow} color="#a855f4" transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

/* ─── Celestial globe with constellations on its surface ─────── */

function CelestialGlobe({ reduced }: { reduced: boolean }) {
  const spin = useRef<THREE.Group>(null);

  const grid = useMemo(() => {
    const segments: LineSegmentDef[] = [];
    const steps = 72;
    const R = GLOBE_RADIUS;
    const step = (i: number) => (i / steps) * Math.PI * 2;

    // meridians (great circles through the poles)
    for (let k = 0; k < 6; k++) {
      const phi = (k * Math.PI) / 6;
      const p = (a: number) => new THREE.Vector3(R * Math.cos(a) * Math.cos(phi), R * Math.sin(a), R * Math.cos(a) * Math.sin(phi));
      for (let i = 0; i < steps; i++) segments.push({ a: p(step(i)), b: p(step(i + 1)), seq: 0 });
    }
    // parallels
    for (const lat of [-60, -30, 0, 30, 60]) {
      const l = THREE.MathUtils.degToRad(lat);
      const r = R * Math.cos(l);
      const y = R * Math.sin(l);
      const p = (a: number) => new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a));
      for (let i = 0; i < steps; i++) segments.push({ a: p(step(i)), b: p(step(i + 1)), seq: 0 });
    }

    return {
      geometry: createLineGeometry(segments),
      material: createLineMaterial({ color: '#a78bfa', width: 1, opacity: 0.22, shimmer: 0, depthFade: true }),
    };
  }, []);

  const constellations = useMemo(
    () =>
      GLOBE_LAYOUT.map((layout) => {
        const shape = CONSTELLATIONS[layout.id];
        const project = sphereProjector(GLOBE_RADIUS, layout);
        const positions = shape.stars.map(([x, y]) => project(x, y));
        const segments: LineSegmentDef[] = [];
        let seq = 0;
        shape.lines.forEach(([ia, ib]) => {
          const steps = Math.max(2, Math.ceil(positions[ia].angleTo(positions[ib]) / 0.06));
          const points = arcPoints(positions[ia], positions[ib], GLOBE_RADIUS * 1.004, steps);
          for (let j = 0; j < steps; j++) segments.push({ a: points[j], b: points[j + 1], seq: seq++ });
        });
        return {
          id: layout.id,
          color: layout.color,
          positions,
          brightness: shape.stars.map((s) => s[2]),
          geometry: createLineGeometry(segments),
          material: createLineMaterial({
            color: layout.color,
            width: 1.8,
            opacity: 0.9,
            count: seq,
            draw: 0,
            shimmer: 0.3,
            depthFade: true,
          }),
        };
      }),
    []
  );

  const stars = useMemo(() => {
    const list: StarPoint[] = [];
    constellations.forEach((c) => {
      const tint = srgb(c.color).lerp(srgb('#ffffff'), 0.6);
      c.positions.forEach((p, i) =>
        list.push({ position: p.clone().multiplyScalar(1.006), size: 2.6 * c.brightness[i], color: tint, phase: Math.random() })
      );
    });
    const faint = srgb('#ddd6fe');
    for (let i = 0; i < 160; i++) {
      list.push({
        position: randomDirection().multiplyScalar(GLOBE_RADIUS * 1.002),
        size: 0.7 + Math.random() * 0.9,
        color: faint,
        phase: Math.random(),
      });
    }
    return {
      geometry: createStarGeometry(list),
      material: createStarMaterial({ size: 2.4, twinkle: 0.45, spikes: 0.6, attenuation: CAMERA_Z, depthFade: true }),
    };
  }, [constellations]);

  useEffect(
    () => () => {
      grid.geometry.dispose();
      grid.material.dispose();
      constellations.forEach((c) => {
        c.geometry.dispose();
        c.material.dispose();
      });
      stars.geometry.dispose();
      stars.material.dispose();
    },
    [grid, constellations, stars]
  );

  useFrame(({ clock, size, viewport }, delta) => {
    const t = clock.elapsedTime;
    if (spin.current && !reduced) spin.current.rotation.y += Math.min(delta, 0.1) * 0.07;

    grid.material.uniforms.uResolution.value.set(size.width, size.height);
    constellations.forEach((c, i) => {
      const u = c.material.uniforms;
      u.uResolution.value.set(size.width, size.height);
      u.uTime.value = t;
      u.uDraw.value = reduced ? 1 : THREE.MathUtils.clamp((t - 0.8 - i * 0.45) / 3.2, 0, 1);
    });
    stars.material.uniforms.uTime.value = reduced ? 0 : t;
    stars.material.uniforms.uPixelRatio.value = viewport.dpr;
  });

  return (
    // 23.4° axial tilt, like a real celestial globe
    <group rotation={[0.18, 0, 0.41]}>
      <group ref={spin}>
        <mesh geometry={grid.geometry} material={grid.material} frustumCulled={false} />
        {constellations.map((c) => (
          <mesh key={c.id} geometry={c.geometry} material={c.material} frustumCulled={false} />
        ))}
        <points geometry={stars.geometry} material={stars.material} frustumCulled={false} />
      </group>
    </group>
  );
}

/* ─── Armillary rings ────────────────────────────────────────── */

function Ring({ config, glow, reduced, index }: { config: RingConfig; glow: THREE.Texture; reduced: boolean; index: number }) {
  const spin = useRef<THREE.Group>(null);
  const bead = useRef<THREE.Group>(null);

  const { geometry, material } = useMemo(() => {
    const steps = 180;
    const segments: LineSegmentDef[] = [];
    const point = (a: number, r: number) => new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
    for (let i = 0; i < steps; i++) {
      segments.push({
        a: point((i / steps) * Math.PI * 2, config.radius),
        b: point(((i + 1) / steps) * Math.PI * 2, config.radius),
        seq: i,
      });
    }
    if (config.ticks) {
      // degree marks, longer every 30° like zodiac divisions
      for (let k = 0; k < 72; k++) {
        const a = (k / 72) * Math.PI * 2;
        const length = k % 6 === 0 ? 0.16 : 0.07;
        segments.push({ a: point(a, config.radius), b: point(a, config.radius + length), seq: Math.floor((k / 72) * steps) });
      }
    }
    return {
      geometry: createLineGeometry(segments),
      material: createLineMaterial({
        color: config.color,
        width: config.width,
        opacity: config.opacity,
        count: steps,
        draw: 0,
        shimmer: 0.25,
        depthFade: true,
      }),
    };
  }, [config]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );

  useFrame(({ clock, size }, delta) => {
    const t = clock.elapsedTime;
    const draw = reduced ? 1 : THREE.MathUtils.clamp((t - 0.3 - index * 0.35) / 2.4, 0, 1);
    material.uniforms.uResolution.value.set(size.width, size.height);
    material.uniforms.uTime.value = t;
    material.uniforms.uDraw.value = draw;
    bead.current?.scale.setScalar(THREE.MathUtils.smoothstep(draw, 0.85, 1));
    if (spin.current && !reduced) spin.current.rotation.y += Math.min(delta, 0.1) * config.speed;
  });

  return (
    <group rotation={config.rotation}>
      <group ref={spin}>
        <mesh geometry={geometry} material={material} frustumCulled={false} />
        <group ref={bead} position={[config.radius, 0, 0]} scale={0}>
          <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color={config.bead} />
          </mesh>
          <sprite scale={0.6}>
            <spriteMaterial map={glow} color={config.bead} transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </group>
      </group>
    </group>
  );
}

function ArmillaryRings({ reduced, glow }: { reduced: boolean; glow: THREE.Texture }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current && !reduced) group.current.rotation.y += Math.min(delta, 0.1) * 0.04;
  });
  return (
    <group ref={group}>
      {RINGS.map((config, i) => (
        <Ring key={config.radius} config={config} glow={glow} reduced={reduced} index={i} />
      ))}
    </group>
  );
}

/* ─── Orbiting star dust disc ────────────────────────────────── */

function OrbitDust({ count, reduced }: { count: number; reduced: boolean }) {
  const spin = useRef<THREE.Group>(null);

  const { geometry, material } = useMemo(() => {
    const palette = ['#c4b5fd', '#e9d5ff', '#f0abfc', '#fdba74', '#ffffff'].map(srgb);
    const stars: StarPoint[] = [];
    for (let i = 0; i < count; i++) {
      const r = 2.9 + Math.pow(Math.random(), 0.8) * 2.4;
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 0.1 * (1 + (r - 2.9) * 1.5);
      stars.push({
        position: new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r),
        size: 0.6 + Math.random() * 1.3,
        color: palette[i % palette.length],
        phase: Math.random(),
      });
    }
    return {
      geometry: createStarGeometry(stars),
      material: createStarMaterial({ size: 2, twinkle: 0.5, attenuation: CAMERA_Z, opacity: 0.8 }),
    };
  }, [count]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );

  useFrame(({ clock, viewport }, delta) => {
    material.uniforms.uPixelRatio.value = viewport.dpr;
    if (reduced) return;
    material.uniforms.uTime.value = clock.elapsedTime;
    if (spin.current) spin.current.rotation.y += Math.min(delta, 0.1) * 0.05;
  });

  return (
    <group rotation={[0.42, 0, -0.18]}>
      <group ref={spin}>
        <points geometry={geometry} material={material} frustumCulled={false} />
      </group>
    </group>
  );
}

/* ─── Scene ──────────────────────────────────────────────────── */

function OrbScene({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const root = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const viewport = useThree((s) => s.viewport);
  const glow = useMemo(() => createGlowTexture(), []);
  const fit = Math.min(1, viewport.width / 5.9);

  useEffect(() => () => glow.dispose(), [glow]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.5);
    if (root.current) {
      // drift slower than the page for a parallax feel
      root.current.position.y = 0.35 - scroll * viewport.height * 0.35;
      root.current.scale.setScalar(fit * (1 - scroll * 0.12));
      if (!reduced) root.current.rotation.y = scroll * 0.6;
    }
    if (tilt.current && !reduced) {
      tilt.current.rotation.x += (mouse.current.y * 0.25 - tilt.current.rotation.x) * dt * 2.5;
      tilt.current.rotation.y += (mouse.current.x * 0.35 - tilt.current.rotation.y) * dt * 2.5;
    }
  });

  return (
    <group ref={root}>
      <group ref={tilt}>
        <OrbCore reduced={reduced} glow={glow} />
        <CelestialGlobe reduced={reduced} />
        <ArmillaryRings reduced={reduced} glow={glow} />
        <OrbitDust count={mobile ? 450 : 900} reduced={reduced} />
      </group>
    </group>
  );
}

function OrbFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-70">
      <Astrolabe className="w-[min(70vw,520px)]" />
    </div>
  );
}

export default function CelestialOrb({ className = '' }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const [env, setEnv] = useState<{ supported: boolean; mobile: boolean } | null>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEnv({ supported: hasWebGL2(), mobile: window.matchMedia('(max-width: 768px)').matches });
  }, []);

  // Stop rendering once the hero scrolls out of view
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '120px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className={className}>
      {env && !env.supported && <OrbFallback />}
      {env?.supported && (
        <CanvasErrorBoundary fallback={<OrbFallback />}>
          <Canvas
            frameloop={visible ? 'always' : 'never'}
            dpr={[1, env.mobile ? 1.5 : 1.75]}
            camera={{ position: [0, 0, CAMERA_Z], fov: 40, near: 0.1, far: 60 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            flat
            style={{ pointerEvents: 'none', opacity: ready ? 1 : 0, transition: 'opacity 1.8s ease-out' }}
            onCreated={() => setReady(true)}
          >
            <OrbScene reduced={reduced} mobile={env.mobile} />
          </Canvas>
        </CanvasErrorBoundary>
      )}
    </div>
  );
}
