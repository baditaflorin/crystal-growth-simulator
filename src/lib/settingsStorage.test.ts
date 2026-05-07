import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_PRESET } from '../features/simulation';
import { loadStoredSettings, saveStoredSettings, settingsForPreset } from './settingsStorage';

describe('settingsStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('loads defaults when storage is empty', () => {
    expect(loadStoredSettings()).toEqual({
      presetId: DEFAULT_PRESET.id,
      settings: DEFAULT_PRESET.settings
    });
  });

  it('round-trips validated settings', () => {
    const next = settingsForPreset('coral');
    saveStoredSettings(next);

    expect(loadStoredSettings()).toEqual(next);
  });

  it('clears invalid stored settings', () => {
    window.localStorage.setItem('crystal-growth-simulator:settings:v1', '{bad-json');

    expect(loadStoredSettings().presetId).toBe(DEFAULT_PRESET.id);
    expect(window.localStorage.getItem('crystal-growth-simulator:settings:v1')).toBeNull();
  });
});
