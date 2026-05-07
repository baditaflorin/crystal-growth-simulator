import { z } from 'zod';
import { DEFAULT_PRESET, findPreset } from '../features/simulation/presets';
import type { PresetId, SimulationSettings } from '../features/simulation/types';

const storageKey = 'crystal-growth-simulator:settings:v1';

const paletteSchema = z.enum(['ice', 'ember', 'reef']);
const presetSchema = z.enum(['snowflake', 'dendrite', 'coral']);

const settingsSchema = z.object({
  gridSize: z.union([z.literal(256), z.literal(384), z.literal(512)]),
  dt: z.number().min(0.1).max(0.8),
  anisotropy: z.number().min(0).max(0.4),
  undercooling: z.number().min(0.05).max(0.5),
  mobility: z.number().min(0.2).max(1.2),
  diffusion: z.number().min(0.02).max(0.5),
  noise: z.number().min(0).max(0.16),
  symmetry: z.number().int().min(3).max(8),
  palette: paletteSchema,
  seedRadius: z.number().min(2).max(16)
});

const storedSchema = z.object({
  presetId: presetSchema,
  settings: settingsSchema
});

export interface StoredSettings {
  presetId: PresetId;
  settings: SimulationSettings;
}

export function loadStoredSettings(): StoredSettings {
  if (typeof window === 'undefined') {
    return { presetId: DEFAULT_PRESET.id, settings: DEFAULT_PRESET.settings };
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return { presetId: DEFAULT_PRESET.id, settings: DEFAULT_PRESET.settings };
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    window.localStorage.removeItem(storageKey);
    return { presetId: DEFAULT_PRESET.id, settings: DEFAULT_PRESET.settings };
  }

  const parsed = storedSchema.safeParse(json);
  if (!parsed.success) {
    window.localStorage.removeItem(storageKey);
    return { presetId: DEFAULT_PRESET.id, settings: DEFAULT_PRESET.settings };
  }

  return parsed.data;
}

export function saveStoredSettings(value: StoredSettings) {
  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

export function settingsForPreset(presetId: PresetId): StoredSettings {
  const preset = findPreset(presetId);
  return {
    presetId,
    settings: preset.settings
  };
}
