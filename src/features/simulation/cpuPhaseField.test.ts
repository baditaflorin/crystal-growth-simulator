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

  it('does not spontaneously nucleate across the whole grid within the first few dozen steps', () => {
    // Regression guard: the per-cell noise term used to be gated by
    // `(1 - phase)`, which is nonzero across the entire untouched background,
    // not just at the solid-liquid interface. Because bulk liquid is a
    // linearly unstable fixed point of the reaction term at these
    // undercooling/nutrient values, that noise spontaneously nucleated solid
    // everywhere at once around step ~25 (coverage jumping from well under
    // 1% to over 15% in a single step), instead of the crystal growing
    // outward from the seed. Coverage should stay small and grow gradually.
    const settings = {
      ...DEFAULT_PRESET.settings,
      gridSize: 256
    };
    const engine = new CpuPhaseFieldEngine();
    engine.reset(settings);

    let frame;
    let maxCoverage = 0;
    for (let i = 0; i < 40; i += 1) {
      frame = engine.step(settings);
      maxCoverage = Math.max(maxCoverage, frame.metrics.coverage);
    }

    // A healthy seed-driven front covers only a small fraction of a 256x256
    // grid after 40 steps. The pre-fix bug blew past 15% within ~5-20 extra
    // steps of this window; 3% leaves generous headroom above normal growth
    // while still catching the runaway.
    expect(maxCoverage).toBeLessThan(0.03);
  });
});
