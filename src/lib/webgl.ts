let cached: boolean | null = null;

/**
 * three.js (r163+) requires WebGL2. Probes support once and releases the
 * probe context so it doesn't count towards the browser's context limit.
 */
export function hasWebGL2(): boolean {
  if (cached !== null) return cached;
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    cached = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}
