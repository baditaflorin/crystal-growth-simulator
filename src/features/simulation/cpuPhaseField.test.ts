import { describe, expect, it } from 'vitest';
import { CpuPhaseFieldEngine, DEFAULT_PRESET } from './index';

describe('CpuPhaseFieldEngine', () => {
  it('grows from the seed and returns an RGBA frame', () => {
    const settings = {
      ...DEFAULT_PRESET.settings,
      gridSize: 256
    };
    const engine = new CpuPhaseFieldEngine();
    engine.reset(settings);

    const first = engine.step(settings);
    const second = engine.step(settings);

    expect(first.width).toBe(256);
    expect(first.pixels).toHaveLength(256 * 256 * 4);
    expect(second.metrics.activeCells).toBeGreaterThan(0);
    expect(second.metrics.growthRate).toBeGreaterThanOrEqual(0);
    expect(second.metrics.coverage).toBeGreaterThan(0);
  });
});
