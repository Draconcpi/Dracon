// Stylised star patterns shared by the 3D scenes and the SVG glyphs.
// Coordinates live in an arbitrary local space (y points up); the third
// value of each star is its relative brightness.

export type ConstellationId =
  | 'draco'
  | 'orion'
  | 'cassiopeia'
  | 'ursaMajor'
  | 'cygnus'
  | 'lyra'
  | 'scorpius';

export interface ConstellationShape {
  name: string;
  stars: ReadonlyArray<readonly [number, number, number]>;
  lines: ReadonlyArray<readonly [number, number]>;
}

export const CONSTELLATIONS: Record<ConstellationId, ConstellationShape> = {
  draco: {
    name: 'Draco',
    stars: [
      [3.2, 1.0, 1.15], [3.75, 1.25, 1.4], [3.95, 0.7, 0.9], [3.4, 0.45, 1.0],
      [2.55, -0.25, 0.9], [1.7, -0.55, 1.0], [0.9, -0.1, 0.85], [0.45, 0.75, 0.9],
      [-0.35, 1.2, 1.0], [-1.25, 0.95, 0.85], [-1.95, 0.3, 1.05], [-2.75, 0.05, 0.85],
      [-3.5, 0.45, 0.95],
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6], [6, 7],
      [7, 8], [8, 9], [9, 10], [10, 11], [11, 12],
    ],
  },
  orion: {
    name: 'Orion',
    stars: [
      [-1.05, 1.45, 1.4], [0.95, 1.25, 1.0], [-0.05, 2.05, 0.8], [-0.4, 0.0, 1.0],
      [0.0, 0.12, 1.1], [0.38, 0.25, 1.0], [-0.85, -1.45, 1.0], [1.1, -1.3, 1.4],
    ],
    lines: [[2, 0], [2, 1], [0, 3], [1, 5], [3, 4], [4, 5], [3, 6], [5, 7]],
  },
  cassiopeia: {
    name: 'Cassiopeia',
    stars: [[-2.0, 0.55, 1.0], [-1.0, -0.05, 1.2], [0.0, 0.35, 1.1], [1.0, -0.35, 0.95], [1.9, 0.4, 0.9]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  ursaMajor: {
    name: 'Ursa Major',
    stars: [
      [-3.0, -0.3, 1.0], [-2.1, 0.15, 1.05], [-1.25, 0.3, 1.1], [-0.4, 0.2, 0.8],
      [-0.25, -0.65, 0.95], [0.95, -0.75, 1.0], [1.05, 0.25, 1.2],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
  },
  cygnus: {
    name: 'Cygnus',
    stars: [
      [0.0, 2.0, 1.4], [0.0, 0.6, 1.1], [0.0, -0.5, 0.8], [0.0, -1.6, 1.0],
      [-1.2, 0.3, 1.0], [-2.1, -0.4, 0.8], [1.15, 0.85, 1.0], [1.9, 1.4, 0.8],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [1, 6], [6, 7]],
  },
  lyra: {
    name: 'Lyra',
    stars: [[0.0, 1.3, 1.5], [0.45, 1.05, 0.7], [0.2, 0.55, 0.8], [0.55, -0.4, 0.85], [-0.05, -0.75, 0.9], [-0.35, 0.15, 0.9]],
    lines: [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 5], [5, 2]],
  },
  scorpius: {
    name: 'Scorpius',
    stars: [
      [-2.55, 1.35, 0.9], [-2.75, 0.75, 1.0], [-2.6, 0.1, 0.85], [-1.9, 0.55, 0.9],
      [-1.35, 0.3, 1.5], [-0.85, 0.0, 0.9], [-0.4, -0.45, 0.95], [-0.1, -1.0, 0.85],
      [0.35, -1.45, 0.9], [0.95, -1.7, 0.85], [1.6, -1.55, 1.0], [2.05, -1.1, 0.9],
      [2.15, -0.55, 0.95], [1.8, -0.3, 1.2],
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7],
      [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13],
    ],
  },
};

export const CONSTELLATION_IDS = Object.keys(CONSTELLATIONS) as ConstellationId[];

export function constellationAt(index: number): ConstellationId {
  return CONSTELLATION_IDS[Math.abs(index) % CONSTELLATION_IDS.length];
}
