'use client';

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import CanvasErrorBoundary from '@/components/three/CanvasErrorBoundary';
import {
  createGlowTexture,
  createLineGeometry,
  createLineMaterial,
  createStarGeometry,
  createStarMaterial,
  srgb,
  type LineSegmentDef,
  type StarPoint,
} from '@/components/three/materials';
import { hasWebGL2 } from '@/lib/webgl';

export interface StarNode {
  id: string;
  name: string;
  color: string;
  /** Position in the 850×420 space used by the admin editor. */
  cx: number;
  cy: number;
}

export interface StarLink {
  id: string;
  fromId: string;
  toId: string;
}

interface DragonConstellation3DProps {
  nodes: StarNode[];
  links: StarLink[];
  activeId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  /** Rendered when WebGL2 is unavailable or the scene fails. */
  fallback?: ReactNode;
  className?: string;
}

type LabelRefs = MutableRefObject<Record<string, HTMLDivElement | null>>;

const VIEW_W = 850;
const VIEW_H = 420;

function toWorld(node: StarNode, index: number) {
  return new THREE.Vector3(
    ((node.cx - VIEW_W / 2) / (VIEW_W / 2)) * 7.2,
    -((node.cy - VIEW_H / 2) / (VIEW_H / 2)) * 3.4,
    Math.sin(index * 12.9898 + 1.3) * 1.4 // deterministic depth for parallax
  );
}

/* ─── A single guardian star ─────────────────────────────────── */

interface StarNodeMeshProps {
  node: StarNode;
  position: THREE.Vector3;
  index: number;
  active: boolean;
  dimmed: boolean;
  glow: THREE.Texture;
  reduced: boolean;
  register: (id: string, group: THREE.Group | null) => void;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

function StarNodeMesh({ node, position, index, active, dimmed, glow, reduced, register, onHover, onSelect }: StarNodeMeshProps) {
  const group = useRef<THREE.Group | null>(null);
  const halo = useRef<THREE.Sprite>(null);
  const reticle = useRef<THREE.Group>(null);

  const arc = useMemo(() => new THREE.RingGeometry(0.34, 0.36, 48, 1, 0, Math.PI * 0.55), []);
  const reticleMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [node.color]
  );
  useEffect(
    () => () => {
      arc.dispose();
      reticleMaterial.dispose();
    },
    [arc, reticleMaterial]
  );

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.1);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, active ? 1.5 : 1, 8, dt));

    if (halo.current) {
      const pulse = reduced ? 1 : 1 + Math.sin(clock.elapsedTime * 1.8 + index) * 0.08;
      halo.current.scale.setScalar(1.6 * pulse);
      halo.current.material.opacity = THREE.MathUtils.damp(halo.current.material.opacity, dimmed ? 0.35 : 0.95, 6, dt);
    }
    if (reticle.current && !reduced) reticle.current.rotation.z += dt * (active ? 1.2 : 0.35);
    reticleMaterial.opacity = THREE.MathUtils.damp(reticleMaterial.opacity, active ? 0.9 : dimmed ? 0.08 : 0.25, 6, dt);
  });

  return (
    <group
      ref={(g) => {
        group.current = g;
        register(node.id, g);
      }}
      position={position}
    >
      <sprite ref={halo} scale={1.6}>
        <spriteMaterial map={glow} color={node.color} transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh>
        <sphereGeometry args={[0.085, 20, 20]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <group ref={reticle}>
        {[0, 1, 2].map((k) => (
          <mesh key={k} geometry={arc} material={reticleMaterial} rotation={[0, 0, (k * Math.PI * 2) / 3]} />
        ))}
      </group>
      {/* Generous invisible hit area */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(node.id);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
      >
        <sphereGeometry args={[0.55, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ─── Scene ──────────────────────────────────────────────────── */

interface SceneProps {
  nodes: StarNode[];
  links: StarLink[];
  activeId: string | null;
  labelRefs: LabelRefs;
  reduced: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

function ConstellationScene({ nodes, links, activeId, labelRefs, reduced, onHover, onSelect }: SceneProps) {
  const root = useRef<THREE.Group>(null);
  const starGroups = useRef<Record<string, THREE.Group | null>>({});
  const mouse = useRef({ x: 0, y: 0 });
  const intro = useRef(reduced ? 1 : 0);
  const activeDraw = useRef(0);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const glow = useMemo(() => createGlowTexture(), []);
  const viewport = useThree((s) => s.viewport);
  const fit = Math.min(1, viewport.width / 16.6, viewport.height / 9);

  const positions = useMemo(() => {
    const map: Record<string, THREE.Vector3> = {};
    nodes.forEach((n, i) => {
      map[n.id] = toWorld(n, i);
    });
    return map;
  }, [nodes]);

  const neighbors = useMemo(() => {
    const set = new Set<string>();
    if (activeId) {
      links.forEach((l) => {
        if (l.fromId === activeId) set.add(l.toId);
        if (l.toId === activeId) set.add(l.fromId);
      });
    }
    return set;
  }, [activeId, links]);

  const base = useMemo(() => {
    const segments: LineSegmentDef[] = [];
    links.forEach((l) => {
      const a = positions[l.fromId];
      const b = positions[l.toId];
      if (a && b) segments.push({ a, b, seq: segments.length });
    });
    return {
      geometry: createLineGeometry(segments),
      material: createLineMaterial({ color: '#a78bfa', width: 1.6, opacity: 0.5, count: segments.length, draw: 0, shimmer: 0.4 }),
    };
  }, [links, positions]);

  // Links of the active star, drawn outwards from it
  const highlight = useMemo(() => {
    const origin = activeId ? positions[activeId] : undefined;
    const activeNode = nodes.find((n) => n.id === activeId);
    if (!origin || !activeNode) return null;
    const segments: LineSegmentDef[] = [];
    links.forEach((l) => {
      const otherId = l.fromId === activeId ? l.toId : l.toId === activeId ? l.fromId : null;
      const other = otherId ? positions[otherId] : undefined;
      if (other) segments.push({ a: origin, b: other, seq: 0 });
    });
    if (segments.length === 0) return null;
    return {
      geometry: createLineGeometry(segments),
      material: createLineMaterial({ color: activeNode.color, width: 2.8, opacity: 1, count: 1, draw: 0, shimmer: 0.2 }),
    };
  }, [activeId, nodes, links, positions]);

  const dust = useMemo(() => {
    const palette = ['#c4b5fd', '#e9d5ff', '#fdba74', '#ffffff'].map(srgb);
    const stars: StarPoint[] = [];
    for (let i = 0; i < 260; i++) {
      stars.push({
        position: new THREE.Vector3((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 12, -2 - Math.random() * 8),
        size: 0.6 + Math.random() * 1.4,
        color: palette[i % palette.length],
        phase: Math.random(),
      });
    }
    return {
      geometry: createStarGeometry(stars),
      material: createStarMaterial({ size: 2, twinkle: 0.6, attenuation: 11, opacity: 0.6 }),
    };
  }, []);

  useEffect(() => {
    activeDraw.current = 0;
    return () => {
      highlight?.geometry.dispose();
      highlight?.material.dispose();
    };
  }, [highlight]);

  useEffect(
    () => () => {
      base.geometry.dispose();
      base.material.dispose();
    },
    [base]
  );

  useEffect(
    () => () => {
      dust.geometry.dispose();
      dust.material.dispose();
      glow.dispose();
    },
    [dust, glow]
  );

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  const register = useCallback((id: string, group: THREE.Group | null) => {
    starGroups.current[id] = group;
  }, []);

  useFrame(({ camera, clock, size, viewport: vp }, delta) => {
    const dt = Math.min(delta, 0.1);
    const t = clock.elapsedTime;

    const g = root.current;
    if (g && !reduced) {
      g.rotation.y += (mouse.current.x * 0.28 + Math.sin(t * 0.2) * 0.06 - g.rotation.y) * dt * 2;
      g.rotation.x += (mouse.current.y * 0.16 - g.rotation.x) * dt * 2;
    }

    intro.current = reduced ? 1 : Math.min(1, intro.current + dt * 0.35);
    activeDraw.current = Math.min(1, activeDraw.current + dt * 2.5);

    const u = base.material.uniforms;
    u.uDraw.value = intro.current;
    u.uTime.value = t;
    u.uResolution.value.set(size.width, size.height);
    u.uOpacity.value = THREE.MathUtils.damp(u.uOpacity.value, activeId ? 0.28 : 0.5, 6, dt);

    if (highlight) {
      const h = highlight.material.uniforms;
      h.uDraw.value = activeDraw.current;
      h.uTime.value = t;
      h.uResolution.value.set(size.width, size.height);
    }

    dust.material.uniforms.uTime.value = reduced ? 0 : t;
    dust.material.uniforms.uPixelRatio.value = vp.dpr;

    // Keep the HTML labels pinned above their stars
    nodes.forEach((n) => {
      const el = labelRefs.current[n.id];
      const star = starGroups.current[n.id];
      if (!el || !star) return;
      star.getWorldPosition(tmp).project(camera);
      const x = (tmp.x * 0.5 + 0.5) * size.width;
      const y = (-tmp.y * 0.5 + 0.5) * size.height - (n.id === activeId ? 34 : 24);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = String(Math.min(1, intro.current * 2));
    });
  });

  return (
    <>
      <points geometry={dust.geometry} material={dust.material} frustumCulled={false} />
      <sprite scale={[22, 12, 1]} position={[0, 0, -6]}>
        <spriteMaterial map={glow} color="#7c22ce" transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <group ref={root} scale={fit}>
        <mesh geometry={base.geometry} material={base.material} frustumCulled={false} />
        {highlight && <mesh geometry={highlight.geometry} material={highlight.material} frustumCulled={false} />}
        {nodes.map((n, i) => (
          <StarNodeMesh
            key={n.id}
            node={n}
            position={positions[n.id]}
            index={i}
            active={n.id === activeId}
            dimmed={!!activeId && n.id !== activeId && !neighbors.has(n.id)}
            glow={glow}
            reduced={reduced}
            register={register}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
      </group>
    </>
  );
}

/* ─── Public component ───────────────────────────────────────── */

export default function DragonConstellation3D({
  nodes,
  links,
  activeId,
  onHover,
  onSelect,
  fallback = null,
  className = '',
}: DragonConstellation3DProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const reduced = !!useReducedMotion();
  const [supported, setSupported] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => setSupported(hasWebGL2()), []);

  // Only render frames while the constellation is on screen
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '80px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [supported]);

  const handleHover = useCallback(
    (id: string | null) => {
      setHovering(id !== null);
      onHover(id);
    },
    [onHover]
  );

  if (supported === false) return <>{fallback}</>;

  return (
    <div ref={wrapRef} className={`relative ${hovering ? 'cursor-pointer' : ''} ${className}`}>
      {/* Darkens the global sky behind so its constellations don't mix with the guardians */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[8%] bg-[radial-gradient(ellipse_at_center,rgba(5,0,16,0.82)_0%,rgba(5,0,16,0.55)_45%,transparent_72%)]"
      />
      {supported && (
        <CanvasErrorBoundary fallback={fallback}>
          <Canvas
            frameloop={visible ? 'always' : 'never'}
            dpr={[1, 1.75]}
            camera={{ position: [0, 0, 11], fov: 42, near: 0.1, far: 60 }}
            gl={{ antialias: true, alpha: true }}
            flat
          >
            <ConstellationScene
              nodes={nodes}
              links={links}
              activeId={activeId}
              labelRefs={labelRefs}
              reduced={reduced}
              onHover={handleHover}
              onSelect={onSelect}
            />
          </Canvas>
        </CanvasErrorBoundary>
      )}

      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {nodes.map((n) => {
          const active = n.id === activeId;
          return (
            <div
              key={n.id}
              ref={(el) => {
                labelRefs.current[n.id] = el;
              }}
              className="absolute left-0 top-0 opacity-0 will-change-transform"
            >
              <span
                className={`block -translate-x-1/2 -translate-y-full whitespace-nowrap font-display text-[11px] uppercase tracking-[0.25em] transition-all duration-300 sm:text-sm ${
                  active ? 'scale-110 font-bold' : activeId ? 'opacity-40' : 'opacity-75'
                }`}
                style={{ color: active ? n.color : '#ddd6fe', textShadow: `0 0 14px ${n.color}` }}
              >
                {n.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
