import type { SimulationSettings } from './types';

export const STRIDE = 4;

// Seed-shape generator. Different presets look identical at frame 0 if every
// crystal starts as the same circular blob, so the seed is sampled per cell:
// snowflakes get a six-fold star, dendrites get a four-fold cross, coral gets
// a soft amorphous disk. Returned value is in [0, 1] and represents the
// initial solid-phase amount at that cell.
function seedSample(dx: number, dy: number, seedRadius: number, symmetry: number): number {
  const distance = Math.sqrt(dx * dx + dy * dy);
  // For amorphous coral-like seeds (symmetry == 0 / very low), fall back to a
  // pure radial disk with a soft edge.
  if (symmetry < 3) {
    return distance <= seedRadius ? 1 : Math.max(0, 1 - (distance - seedRadius) / 2);
  }
  // For crystalline seeds, fold the angle into the requested rotational
  // symmetry and stretch the effective radius along symmetry axes so the
  // seed already looks like a snowflake / dendrite / etc.
  if (distance === 0) {
    return 1;
  }
  const angle = Math.atan2(dy, dx);
  const lobe = 0.5 + 0.5 * Math.cos(symmetry * angle);
  const effectiveRadius = seedRadius * (0.55 + 0.6 * lobe);
  if (distance <= effectiveRadius) {
    return 1;
  }
  const softEdge = (distance - effectiveRadius) / Math.max(1, seedRadius * 0.4);
  return Math.max(0, 1 - softEdge);
}

export function createInitialField(settings: SimulationSettings) {
  const { gridSize, seedRadius, symmetry } = settings;
  const field = new Float32Array(gridSize * gridSize * STRIDE);
  const center = (gridSize - 1) / 2;

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const idx = (y * gridSize + x) * STRIDE;
      const dx = x - center;
      const dy = y - center;
      const seed = seedSample(dx, dy, seedRadius, symmetry);

      field[idx] = seed;
      field[idx + 1] = Math.max(0.15, 1 - seed * 0.45);
      field[idx + 2] = seed > 0.2 ? 1 : 0;
      field[idx + 3] = 0;
    }
  }

  return field;
}

export function wrapCoord(value: number, size: number) {
  if (value < 0) {
    return size - 1;
  }
  if (value >= size) {
    return 0;
  }
  return value;
}

export function cellIndex(x: number, y: number, size: number) {
  return (wrapCoord(y, size) * size + wrapCoord(x, size)) * STRIDE;
}

// hashNoise returns a pseudo-random scalar in [0, 1) given an (x, y, frame)
// triple — the classic GLSL fract(sin(dot * c)) hack. The previous version
// used `% 1` directly, which in JavaScript is *remainder* (not modulo) and
// returns negative values for negative inputs, so the output ranged over
// (-1, 1) instead of [0, 1). Downstream code does `hashNoise(...) - 0.5`
// expecting a centred zero-mean perturbation, but with the old version the
// effective mean was -0.5, biasing crystal growth toward shrinkage. Wrap
// into [0, 1) explicitly.
export function hashNoise(x: number, y: number, frame: number) {
  const dot = x * 12.9898 + y * 78.233 + frame * 0.173;
  const raw = Math.sin(dot) * 43758.5453;
  const r = raw % 1;
  return r < 0 ? r + 1 : r;
}
