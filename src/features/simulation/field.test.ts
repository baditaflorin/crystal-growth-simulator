import { describe, expect, it } from 'vitest';

import { createInitialField, hashNoise, STRIDE } from './field';
import { PRESETS } from './presets';

describe('hashNoise', () => {
  it('returns values strictly in [0, 1)', () => {
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    const samples = 5000;
    for (let i = 0; i < samples; i += 1) {
      const v = hashNoise(i * 1.7, i * 0.41, i);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      if (v < min) min = v;
      if (v > max) max = v;
      sum += v;
    }
    // The earlier implementation produced values in (-1, 1), so the mean
    // was near zero. Real uniform [0, 1) noise should average near 0.5.
    const mean = sum / samples;
    expect(mean).toBeGreaterThan(0.4);
    expect(mean).toBeLessThan(0.6);
  });
});

describe('createInitialField', () => {
  it('produces a denser seed centre than its rim for every preset', () => {
    for (const preset of PRESETS) {
      const field = createInitialField(preset.settings);
      const size = preset.settings.gridSize;
      const centerIdx = (Math.floor(size / 2) * size + Math.floor(size / 2)) * STRIDE;
      const cornerIdx = 0;
      expect(field[centerIdx]).toBeGreaterThan(field[cornerIdx]);
    }
  });

  it('emits visually distinct starting shapes for distinct presets', () => {
    // Snowflake (symmetry 6) vs Coral (symmetry 7 in the preset, but low
    // enough lobed structure should still differ from a pure circle).
    // We sample a ring of cells at radius ~= seedRadius and check that the
    // seed values vary around the ring (not constant, as a pure disk would
    // give). This is the regression guard against "all presets look like
    // identical circles at frame 0".
    const preset = PRESETS.find((p) => p.id === 'snowflake');
    if (!preset) throw new Error('snowflake preset missing');
    const field = createInitialField(preset.settings);
    const size = preset.settings.gridSize;
    const center = Math.floor(size / 2);
    const r = preset.settings.seedRadius;
    const samples: number[] = [];
    for (let theta = 0; theta < Math.PI * 2; theta += Math.PI / 12) {
      const x = Math.round(center + r * Math.cos(theta));
      const y = Math.round(center + r * Math.sin(theta));
      samples.push(field[(y * size + x) * STRIDE]);
    }
    const min = Math.min(...samples);
    const max = Math.max(...samples);
    expect(max - min).toBeGreaterThan(0.1);
  });
});
