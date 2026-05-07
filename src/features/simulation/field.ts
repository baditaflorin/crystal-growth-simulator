import type { SimulationSettings } from './types';

export const STRIDE = 4;

export function createInitialField(settings: SimulationSettings) {
  const { gridSize, seedRadius } = settings;
  const field = new Float32Array(gridSize * gridSize * STRIDE);
  const center = (gridSize - 1) / 2;

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const idx = (y * gridSize + x) * STRIDE;
      const dx = x - center;
      const dy = y - center;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const seed = distance <= seedRadius ? 1 : Math.max(0, 1 - (distance - seedRadius) / 2);

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

export function hashNoise(x: number, y: number, frame: number) {
  const dot = x * 12.9898 + y * 78.233 + frame * 0.173;
  return (Math.sin(dot) * 43758.5453) % 1;
}
