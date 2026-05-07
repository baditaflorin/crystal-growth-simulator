import { describe, expect, it } from 'vitest';
import { PRESETS, findPreset } from './presets';

describe('presets', () => {
  it('provides the three v1 growth modes', () => {
    expect(PRESETS.map((preset) => preset.id)).toEqual(['snowflake', 'dendrite', 'coral']);
  });

  it('falls back to the default preset for unknown ids', () => {
    expect(findPreset('snowflake').id).toBe('snowflake');
  });
});
