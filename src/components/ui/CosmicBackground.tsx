'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Generate a circular star sprite texture ─────────────────────
function createStarTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Radial gradient: bright center → transparent edge (circular)
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.15, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.4, 'rgba(200,180,255,0.3)');
  gradient.addColorStop(1, 'rgba(200,180,255,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ─── Stars (Points) ──────────────────────────────────────────────
function Stars({ count = 600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const starTexture = useMemo(() => createStarTexture(), []);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      sz[i] = Math.random() * 1.5 + 0.3;
    }
    return [pos, sz];
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.015;
    ref.current.rotation.x = Math.sin(t * 0.01) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        map={starTexture}
        size={0.12}
        color="#c4b5ff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Cosmic Dust (larger faint particles) ────────────────────────
function CosmicDustParticles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const dustTexture = useMemo(() => createStarTexture(), []);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = -t * 0.008;
    ref.current.rotation.z = Math.cos(t * 0.005) * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={dustTexture}
        size={0.18}
        color="#a855f4"
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Constellation Line Segment (memoized) ──────────────────────
function ConstellationLineSegment({ start, end }: { start: number[]; end: number[] }) {
  const lineRef = useRef<THREE.Line>(null);

  const lineObj = useMemo(() => {
    const points = [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: '#a855f4',
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(geometry, material);
  }, [start, end]);

  return <primitive ref={lineRef} object={lineObj} />;
}

// ─── Constellation Lines (3D) ────────────────────────────────────
function ConstellationLines3D() {
  const ref = useRef<THREE.Group>(null);

  const constellations = useMemo(() => {
    // Multiple small constellations placed in 3D space
    const groups = [
      {
        stars: [
          [-8, 4, -10], [-6, 5.5, -11], [-4, 4.8, -10.5],
          [-3, 3, -10], [-5, 2, -11], [-7, 2.5, -10.5],
        ],
        connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],
      },
      {
        stars: [
          [6, 3, -12], [8, 5, -13], [10, 4, -12],
          [9, 1, -13], [7, 0, -12],
        ],
        connections: [[0,1],[1,2],[2,3],[3,4],[4,0],[1,3]],
      },
      {
        stars: [
          [-2, -3, -14], [0, -1, -15], [2, -2, -14],
          [3, -5, -15], [0, -6, -14], [-2, -5, -15],
        ],
        connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,4]],
      },
      {
        stars: [
          [12, -2, -11], [14, 0, -12], [13, 2, -11],
          [11, 1, -12],
        ],
        connections: [[0,1],[1,2],[2,3],[3,0],[0,2]],
      },
      {
        stars: [
          [-12, -1, -13], [-10, 1, -14], [-9, -1, -13],
          [-11, -3, -14],
        ],
        connections: [[0,1],[1,2],[2,3],[3,0]],
      },
    ];
    return groups;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.01;
  });

  return (
    <group ref={ref}>
      {constellations.map((constellation, ci) => (
        <group key={ci}>
          {/* Lines */}
          {constellation.connections.map(([a, b], li) => {
            const start = constellation.stars[a];
            const end = constellation.stars[b];
            return <ConstellationLineSegment key={li} start={start} end={end} />;
          })}
          {/* Star nodes */}
          {constellation.stars.map((pos, si) => (
            <mesh key={si} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial
                color="#c4b5ff"
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ─── Mouse-reactive camera ───────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.current.y * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, -10);
  });

  return null;
}

// ─── Main Export ──────────────────────────────────────────────────
export default function CosmicBackground() {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'transparent' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          powerPreference: 'low-power',
          alpha: true,
        }}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        <CameraRig />
        <Stars count={500} />
        <CosmicDustParticles count={60} />
        <ConstellationLines3D />
      </Canvas>
    </div>
  );
}
