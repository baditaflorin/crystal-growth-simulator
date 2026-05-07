export type PresetId = 'snowflake' | 'dendrite' | 'coral';

export type PaletteId = 'ice' | 'ember' | 'reef';

export interface SimulationSettings {
  gridSize: number;
  dt: number;
  anisotropy: number;
  undercooling: number;
  mobility: number;
  diffusion: number;
  noise: number;
  symmetry: number;
  palette: PaletteId;
  seedRadius: number;
}

export interface SimulationMetrics {
  fps: number;
  activeCells: number;
  growthRate: number;
  coverage: number;
  frame: number;
}

export interface SimulationFrame {
  width: number;
  height: number;
  pixels: Uint8Array;
  metrics: Omit<SimulationMetrics, 'fps'>;
}

export interface SimulationEngine {
  readonly mode: 'webgpu' | 'cpu';
  reset(settings: SimulationSettings): Promise<void> | void;
  step(settings: SimulationSettings): Promise<SimulationFrame> | SimulationFrame;
  dispose(): void;
}

export const GRID_OPTIONS = [256, 384, 512] as const;

export const PALETTE_INDEX: Record<PaletteId, number> = {
  ice: 0,
  ember: 1,
  reef: 2
};
