import { create } from 'zustand';
import type { PresetId, SimulationSettings } from '../features/simulation';
import { loadStoredSettings, saveStoredSettings, settingsForPreset } from '../lib/settingsStorage';

interface CrystalStore {
  presetId: PresetId;
  settings: SimulationSettings;
  setPreset: (presetId: PresetId) => void;
  updateSettings: (settings: Partial<SimulationSettings>) => void;
}

const initial = loadStoredSettings();

export const useCrystalStore = create<CrystalStore>((set, get) => ({
  presetId: initial.presetId,
  settings: initial.settings,
  setPreset(presetId) {
    const next = settingsForPreset(presetId);
    saveStoredSettings(next);
    set(next);
  },
  updateSettings(settings) {
    const next = {
      presetId: get().presetId,
      settings: {
        ...get().settings,
        ...settings
      }
    };
    saveStoredSettings(next);
    set(next);
  }
}));
