import * as THREE from 'three';

/* ───────────────────────────────────────────────────────────────
 * Shared building blocks for the celestial 3D scenes.
 * Custom shaders work directly in display (sRGB) space so the
 * colours match the CSS palette exactly.
 * ─────────────────────────────────────────────────────────────── */

/** Hex colour → raw sRGB components (no colour-management conversion). */
export function srgb(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex).convertLinearToSRGB();
  return new THREE.Vector3(c.r, c.g, c.b);
}

/** Uniformly distributed unit vector. */
export function randomDirection(): THREE.Vector3 {
  const z = Math.random() * 2 - 1;
  const phi = Math.random() * Math.PI * 2;
  const r = Math.sqrt(1 - z * z);
  return new THREE.Vector3(r * Math.cos(phi), z, r * Math.sin(phi));
}

/** 3D value noise + fbm (5 octaves). */
export const NOISE_GLSL = /* glsl */ `
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.02 + vec3(1.7, 9.2, 3.1);
      a *= 0.5;
    }
    return v;
  }
`;

/* ─── Screen-space glowing lines (constellation links) ───────── */

const LINE_VERTEX = /* glsl */ `
  attribute vec3 aEnd;
  attribute float aSide;
  attribute float aT;
  attribute float aSeq;
  uniform vec2 uResolution;
  uniform float uWidth;
  uniform float uDepthFade;
  varying float vT;
  varying float vSide;
  varying float vSeq;
  varying float vFade;

  void main() {
    vec4 viewStart = modelViewMatrix * vec4(position, 1.0);
    vec4 viewEnd = modelViewMatrix * vec4(aEnd, 1.0);
    vec4 clipStart = projectionMatrix * viewStart;
    vec4 clipEnd = projectionMatrix * viewEnd;

    vT = aT;
    vSide = aSide;
    vSeq = aSeq;
    vFade = 1.0;

    // Fade the far side of anything drawn around the object's origin
    if (uDepthFade > 0.5) {
      vec3 viewPos = mix(viewStart.xyz, viewEnd.xyz, aT);
      vec3 center = (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
      vec3 rel = viewPos - center;
      float facing = dot(rel / max(length(rel), 1e-4), normalize(-viewPos));
      vFade = 0.12 + 0.88 * smoothstep(-0.3, 0.25, facing);
    }

    if (clipStart.w <= 0.0 || clipEnd.w <= 0.0) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      return;
    }

    vec2 dir = (clipEnd.xy / clipEnd.w - clipStart.xy / clipStart.w) * uResolution;
    float len = length(dir);
    dir = len > 1e-5 ? dir / len : vec2(1.0, 0.0);
    vec2 normal = vec2(-dir.y, dir.x);

    vec4 clip = mix(clipStart, clipEnd, aT);
    clip.xy += normal * aSide * (uWidth / uResolution) * clip.w;
    gl_Position = clip;
  }
`;

const LINE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uDraw;
  uniform float uCount;
  uniform float uTime;
  uniform float uShimmer;
  varying float vT;
  varying float vSide;
  varying float vSeq;
  varying float vFade;

  void main() {
    // Segments are revealed one after another as uDraw goes 0 → 1
    float local = clamp(uDraw * uCount - vSeq, 0.0, 1.0);
    if (local <= 0.0 || vT > local) discard;

    float core = 1.0 - abs(vSide);
    float alpha = core * core * (3.0 - 2.0 * core);
    float shimmer = 1.0 - uShimmer * (0.5 + 0.5 * sin(uTime * 1.6 - vT * 6.0 - vSeq * 1.7));
    float tip = local < 1.0 ? smoothstep(local - 0.25, local, vT) : 0.0;

    gl_FragColor = vec4(uColor * (shimmer + tip * 1.4), alpha * uOpacity * vFade);
  }
`;

const METEOR_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vT;
  varying float vSide;

  void main() {
    float core = 1.0 - abs(vSide);
    float alpha = core * core * pow(vT, 2.2) * uOpacity;
    gl_FragColor = vec4(mix(uColor, vec3(1.0), vT * 0.7), alpha);
  }
`;

export interface LineSegmentDef {
  a: THREE.Vector3;
  b: THREE.Vector3;
  /** Draw order: segments with the same seq are revealed together. */
  seq: number;
}

/** Each segment becomes a camera-facing quad expanded in the vertex shader. */
export function createLineGeometry(segments: ReadonlyArray<LineSegmentDef>): THREE.BufferGeometry {
  const count = segments.length;
  const start = new Float32Array(count * 12);
  const end = new Float32Array(count * 12);
  const side = new Float32Array(count * 4);
  const t = new Float32Array(count * 4);
  const seq = new Float32Array(count * 4);
  const index: number[] = [];

  segments.forEach(({ a, b, seq: order }, i) => {
    for (let v = 0; v < 4; v++) {
      const k = i * 4 + v;
      start.set([a.x, a.y, a.z], k * 3);
      end.set([b.x, b.y, b.z], k * 3);
      t[k] = v < 2 ? 0 : 1;
      side[k] = v % 2 === 0 ? -1 : 1;
      seq[k] = order;
    }
    const o = i * 4;
    index.push(o, o + 1, o + 2, o + 2, o + 1, o + 3);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(start, 3));
  geometry.setAttribute('aEnd', new THREE.BufferAttribute(end, 3));
  geometry.setAttribute('aSide', new THREE.BufferAttribute(side, 1));
  geometry.setAttribute('aT', new THREE.BufferAttribute(t, 1));
  geometry.setAttribute('aSeq', new THREE.BufferAttribute(seq, 1));
  geometry.setIndex(index);
  return geometry;
}

/** Convenience: pairs of points revealed in order. */
export function sequentialSegments(pairs: ReadonlyArray<readonly [THREE.Vector3, THREE.Vector3]>): LineSegmentDef[] {
  return pairs.map(([a, b], i) => ({ a, b, seq: i }));
}

interface LineMaterialOptions {
  color: string;
  width?: number;
  opacity?: number;
  count?: number;
  draw?: number;
  shimmer?: number;
  depthFade?: boolean;
}

export function createLineMaterial({
  color,
  width = 2,
  opacity = 1,
  count = 1,
  draw = 1,
  shimmer = 0.3,
  depthFade = false,
}: LineMaterialOptions): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: srgb(color) },
      uOpacity: { value: opacity },
      uWidth: { value: width },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uDraw: { value: draw },
      uCount: { value: Math.max(1, count) },
      uTime: { value: 0 },
      uShimmer: { value: shimmer },
      uDepthFade: { value: depthFade ? 1 : 0 },
    },
    vertexShader: LINE_VERTEX,
    fragmentShader: LINE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
}

export function createMeteorMaterial(color: string): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: srgb(color) },
      uOpacity: { value: 0 },
      uWidth: { value: 2.2 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uDepthFade: { value: 0 },
    },
    vertexShader: LINE_VERTEX,
    fragmentShader: METEOR_FRAGMENT,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
}

/* ─── Twinkling star points ──────────────────────────────────── */

const STAR_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uTwinkle;
  uniform float uAttenuation;
  uniform float uDepthFade;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float speed = 0.5 + fract(aPhase * 7.31) * 1.7;
    float twinkle = 1.0 - uTwinkle * (0.5 + 0.5 * sin(uTime * speed + aPhase * 6.2831));
    float size = aSize * uSize * uPixelRatio * (0.8 + 0.2 * twinkle);
    if (uAttenuation > 0.0) size *= uAttenuation / max(-mv.z, 0.001);

    gl_PointSize = size;
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
    vAlpha = twinkle;

    if (uDepthFade > 0.5) {
      vec3 center = (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
      vec3 rel = mv.xyz - center;
      float facing = dot(rel / max(length(rel), 1e-4), normalize(-mv.xyz));
      vAlpha *= 0.12 + 0.88 * smoothstep(-0.3, 0.25, facing);
    }
  }
`;

const STAR_FRAGMENT = /* glsl */ `
  uniform float uOpacity;
  uniform float uSpikes;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    if (d > 1.0) discard;

    float glow = pow(1.0 - d, 2.6);
    float core = 1.0 - smoothstep(0.0, 0.28, d);
    float spikes = (max(0.0, 1.0 - abs(uv.x) * 24.0) + max(0.0, 1.0 - abs(uv.y) * 24.0)) * (1.0 - d) * uSpikes;
    float a = (glow * 0.85 + core * 0.9 + spikes * 0.55) * vAlpha * uOpacity;
    if (a < 0.004) discard;

    gl_FragColor = vec4(vColor + core * 0.4, min(a, 1.0));
  }
`;

export interface StarPoint {
  position: THREE.Vector3;
  size: number;
  color: THREE.Vector3;
  phase: number;
}

export function createStarGeometry(stars: ReadonlyArray<StarPoint>): THREE.BufferGeometry {
  const positions = new Float32Array(stars.length * 3);
  const colors = new Float32Array(stars.length * 3);
  const sizes = new Float32Array(stars.length);
  const phases = new Float32Array(stars.length);

  stars.forEach((s, i) => {
    positions.set([s.position.x, s.position.y, s.position.z], i * 3);
    colors.set([s.color.x, s.color.y, s.color.z], i * 3);
    sizes[i] = s.size;
    phases[i] = s.phase;
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  return geometry;
}

interface StarMaterialOptions {
  size?: number;
  opacity?: number;
  twinkle?: number;
  spikes?: number;
  /** > 0 enables perspective size attenuation (reference distance). */
  attenuation?: number;
  depthFade?: boolean;
}

export function createStarMaterial({
  size = 1,
  opacity = 1,
  twinkle = 0.4,
  spikes = 0,
  attenuation = 0,
  depthFade = false,
}: StarMaterialOptions = {}): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: size },
      uOpacity: { value: opacity },
      uTwinkle: { value: twinkle },
      uSpikes: { value: spikes },
      uAttenuation: { value: attenuation },
      uDepthFade: { value: depthFade ? 1 : 0 },
    },
    vertexShader: STAR_VERTEX,
    fragmentShader: STAR_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/* ─── Placement helpers ──────────────────────────────────────── */

export interface SkyPlacement {
  /** Azimuth in degrees (0 = straight ahead, positive = right). */
  az: number;
  /** Elevation in degrees. */
  el: number;
  /** In-plane rotation in radians. */
  rot: number;
  /** Angular size (radians) of one local shape unit. */
  scale: number;
}

/** Returns a function mapping local 2D shape coords onto a sphere. */
export function sphereProjector(radius: number, { az, el, rot, scale }: SkyPlacement) {
  const azR = THREE.MathUtils.degToRad(az);
  const elR = THREE.MathUtils.degToRad(el);
  const center = new THREE.Vector3(
    Math.cos(elR) * Math.sin(azR),
    Math.sin(elR),
    -Math.cos(elR) * Math.cos(azR)
  );
  const worldUp = Math.abs(center.y) > 0.98 ? new THREE.Vector3(0, 0, -1) : new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(center, worldUp).normalize();
  const up = new THREE.Vector3().crossVectors(right, center).normalize();
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);

  return (x: number, y: number) => {
    const rx = (x * cos - y * sin) * scale;
    const ry = (x * sin + y * cos) * scale;
    return center.clone().addScaledVector(right, rx).addScaledVector(up, ry).normalize().multiplyScalar(radius);
  };
}

/** Great-circle arc between two points on a sphere, split into segments. */
export function arcPoints(a: THREE.Vector3, b: THREE.Vector3, radius: number, steps: number): THREE.Vector3[] {
  const na = a.clone().normalize();
  const nb = b.clone().normalize();
  const angle = na.angleTo(nb);
  const s = Math.sin(angle);
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p =
      s < 1e-5
        ? na.clone().lerp(nb, t)
        : na.clone().multiplyScalar(Math.sin((1 - t) * angle) / s).addScaledVector(nb, Math.sin(t * angle) / s);
    points.push(p.normalize().multiplyScalar(radius));
  }
  return points;
}

/* ─── Canvas textures ────────────────────────────────────────── */

export function createGlowTexture(size = 128): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.18, 'rgba(255,255,255,0.6)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.14)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Letter-spaced label rendered to a texture (used for constellation names). */
export function createLabelTexture(text: string, fontFamily: string) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const fontSize = 40;
  const font = `600 ${fontSize}px ${fontFamily}`;
  ctx.font = font;
  const chars = Array.from(text.toUpperCase());
  const spacing = fontSize * 0.5;
  const widths = chars.map((c) => ctx.measureText(c).width);
  const textWidth = widths.reduce((sum, w) => sum + w, 0) + spacing * (chars.length - 1);
  const pad = 28;

  canvas.width = Math.ceil(textWidth + pad * 2);
  canvas.height = 72;
  ctx.font = font; // resizing the canvas resets the context state
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(233, 225, 255, 1)';
  ctx.shadowColor = 'rgba(168, 85, 244, 0.9)';
  ctx.shadowBlur = 14;

  let x = pad;
  chars.forEach((c, i) => {
    ctx.fillText(c, x, canvas.height / 2);
    x += widths[i] + spacing;
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return { texture, aspect: canvas.width / canvas.height };
}
