import { colorCell } from './color';
import { cellIndex, createInitialField, hashNoise } from './field';
import type { SimulationEngine, SimulationFrame, SimulationSettings } from './types';

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export class CpuPhaseFieldEngine implements SimulationEngine {
  readonly mode = 'cpu' as const;

  private field = new Float32Array();
  private next = new Float32Array();
  private pixels = new Uint8Array();
  private frame = 0;
  private size = 0;

  reset(settings: SimulationSettings) {
    this.size = settings.gridSize;
    this.field = createInitialField(settings);
    this.next = new Float32Array(this.field.length);
    this.pixels = new Uint8Array(this.size * this.size * 4);
    this.frame = 0;
  }

  step(settings: SimulationSettings): SimulationFrame {
    if (this.size !== settings.gridSize || this.field.length === 0) {
      this.reset(settings);
    }

    const size = this.size;
    let activeCells = 0;
    let growthRate = 0;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = cellIndex(x, y, size);
        const left = cellIndex(x - 1, y, size);
        const right = cellIndex(x + 1, y, size);
        const up = cellIndex(x, y - 1, size);
        const down = cellIndex(x, y + 1, size);

        const phase = this.field[idx];
        const nutrient = this.field[idx + 1];
        const age = this.field[idx + 2];

        const lapPhase =
          this.field[left] + this.field[right] + this.field[up] + this.field[down] - phase * 4;
        const lapNutrient =
          this.field[left + 1] +
          this.field[right + 1] +
          this.field[up + 1] +
          this.field[down + 1] -
          nutrient * 4;
        const gradX = (this.field[right] - this.field[left]) * 0.5;
        const gradY = (this.field[down] - this.field[up]) * 0.5;
        const angle = Math.atan2(gradY, gradX);
        const anisotropy = 1 + settings.anisotropy * Math.cos(settings.symmetry * angle);
        const front = phase * (1 - phase);
        const drive = phase - 0.5 + settings.undercooling + (nutrient - 0.52) * 0.72;
        const stochastic = (hashNoise(x, y, this.frame) - 0.5) * settings.noise * (1 - phase);
        const delta =
          settings.dt * settings.mobility * (anisotropy * lapPhase + front * drive + stochastic);
        const nextPhase = clamp01(phase + delta);
        const growth = Math.max(0, nextPhase - phase);
        const nextNutrient = clamp01(
          nutrient + settings.dt * (settings.diffusion * lapNutrient - growth * 0.42)
        );

        this.next[idx] = nextPhase;
        this.next[idx + 1] = nextNutrient;
        this.next[idx + 2] = age > 0 || nextPhase < 0.18 ? age + nextPhase * 0.03 : this.frame;
        this.next[idx + 3] = 0;

        const color = colorCell(nextPhase, nextNutrient, this.next[idx + 2], settings.palette);
        const px = (y * size + x) * 4;
        this.pixels[px] = color.r;
        this.pixels[px + 1] = color.g;
        this.pixels[px + 2] = color.b;
        this.pixels[px + 3] = color.a;

        if (nextPhase > 0.2) {
          activeCells += 1;
        }
        growthRate += growth;
      }
    }

    const previous = this.field;
    this.field = this.next;
    this.next = previous;
    this.frame += 1;

    return {
      width: size,
      height: size,
      pixels: this.pixels.slice(),
      metrics: {
        activeCells,
        growthRate,
        coverage: activeCells / (size * size),
        frame: this.frame
      }
    };
  }

  dispose() {
    this.field = new Float32Array();
    this.next = new Float32Array();
    this.pixels = new Uint8Array();
  }
}
