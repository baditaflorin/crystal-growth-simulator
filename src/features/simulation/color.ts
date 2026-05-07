import type { PaletteId } from './types';

interface Rgb {
  r: number;
  g: number;
  b: number;
}

const palettes: Record<PaletteId, { low: Rgb; mid: Rgb; high: Rgb; glow: Rgb }> = {
  ice: {
    low: { r: 6, g: 15, b: 29 },
    mid: { r: 64, g: 213, b: 224 },
    high: { r: 240, g: 249, b: 255 },
    glow: { r: 255, g: 207, b: 90 }
  },
  ember: {
    low: { r: 17, g: 15, b: 23 },
    mid: { r: 242, g: 106, b: 85 },
    high: { r: 255, g: 222, b: 138 },
    glow: { r: 79, g: 216, b: 196 }
  },
  reef: {
    low: { r: 8, g: 18, b: 24 },
    mid: { r: 106, g: 213, b: 119 },
    high: { r: 252, g: 126, b: 151 },
    glow: { r: 139, g: 214, b: 255 }
  }
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return {
    r: mix(a.r, b.r, t),
    g: mix(a.g, b.g, t),
    b: mix(a.b, b.b, t)
  };
}

export function colorCell(phase: number, nutrient: number, age: number, paletteId: PaletteId) {
  const palette = palettes[paletteId];
  const core =
    phase < 0.52
      ? mixRgb(palette.low, palette.mid, phase / 0.52)
      : mixRgb(palette.mid, palette.high, (phase - 0.52) / 0.48);
  const tip = clamp01((1 - nutrient) * phase * 1.7 + Math.sin(age * 0.07) * 0.04);
  const glow = mixRgb(core, palette.glow, tip);

  return {
    r: Math.round(glow.r),
    g: Math.round(glow.g),
    b: Math.round(glow.b),
    a: 255
  };
}
