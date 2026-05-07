import type { PresetId, SimulationSettings } from './types';

export interface CrystalPreset {
  id: PresetId;
  name: string;
  shortName: string;
  settings: SimulationSettings;
}

export const PRESETS: CrystalPreset[] = [
  {
    id: 'snowflake',
    name: 'Snowflake',
    shortName: 'Snow',
    settings: {
      gridSize: 384,
      dt: 0.42,
      anisotropy: 0.18,
      undercooling: 0.29,
      mobility: 0.74,
      diffusion: 0.24,
      noise: 0.018,
      symmetry: 6,
      palette: 'ice',
      seedRadius: 5
    }
  },
  {
    id: 'dendrite',
    name: 'Dendritic crystal',
    shortName: 'Dendrite',
    settings: {
      gridSize: 384,
      dt: 0.38,
      anisotropy: 0.26,
      undercooling: 0.33,
      mobility: 0.82,
      diffusion: 0.18,
      noise: 0.012,
      symmetry: 4,
      palette: 'ember',
      seedRadius: 4
    }
  },
  {
    id: 'coral',
    name: 'Coral mineral',
    shortName: 'Coral',
    settings: {
      gridSize: 384,
      dt: 0.36,
      anisotropy: 0.07,
      undercooling: 0.25,
      mobility: 0.68,
      diffusion: 0.11,
      noise: 0.09,
      symmetry: 7,
      palette: 'reef',
      seedRadius: 9
    }
  }
];

export const DEFAULT_PRESET = PRESETS[0];

export function findPreset(id: PresetId) {
  return PRESETS.find((preset) => preset.id === id) ?? DEFAULT_PRESET;
}
