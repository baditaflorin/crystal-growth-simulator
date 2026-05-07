import { createInitialField } from './field';
import {
  PALETTE_INDEX,
  type SimulationEngine,
  type SimulationFrame,
  type SimulationSettings
} from './types';

const WORKGROUP_SIZE = 8;
const STATE_STRIDE_BYTES = 16;

const shader = /* wgsl */ `
struct Params {
  width: f32,
  height: f32,
  dt: f32,
  anisotropy: f32,
  undercooling: f32,
  mobility: f32,
  diffusion: f32,
  noise: f32,
  symmetry: f32,
  time: f32,
  palette: f32,
  pad: f32,
}

@group(0) @binding(0) var<storage, read> stateIn: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> stateOut: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> colors: array<u32>;
@group(0) @binding(3) var<storage, read_write> stats: array<atomic<u32>>;
@group(0) @binding(4) var<uniform> params: Params;

fn wrapCoord(value: i32, size: i32) -> i32 {
  if (value < 0) {
    return size - 1;
  }
  if (value >= size) {
    return 0;
  }
  return value;
}

fn idx(x: i32, y: i32) -> u32 {
  let width = i32(params.width);
  let height = i32(params.height);
  return u32(wrapCoord(y, height) * width + wrapCoord(x, width));
}

fn hashNoise(x: f32, y: f32, t: f32) -> f32 {
  let n = sin(dot(vec3<f32>(x, y, t), vec3<f32>(12.9898, 78.233, 0.173))) * 43758.5453;
  return fract(n);
}

fn mix3(a: vec3<f32>, b: vec3<f32>, t: f32) -> vec3<f32> {
  return a + (b - a) * clamp(t, 0.0, 1.0);
}

fn paletteColor(phase: f32, nutrient: f32, age: f32) -> vec3<f32> {
  var low = vec3<f32>(0.024, 0.059, 0.114);
  var mid = vec3<f32>(0.25, 0.835, 0.878);
  var high = vec3<f32>(0.941, 0.976, 1.0);
  var glow = vec3<f32>(1.0, 0.812, 0.353);

  if (i32(params.palette) == 1) {
    low = vec3<f32>(0.067, 0.059, 0.09);
    mid = vec3<f32>(0.949, 0.416, 0.333);
    high = vec3<f32>(1.0, 0.871, 0.541);
    glow = vec3<f32>(0.31, 0.847, 0.769);
  }

  if (i32(params.palette) == 2) {
    low = vec3<f32>(0.031, 0.071, 0.094);
    mid = vec3<f32>(0.416, 0.835, 0.467);
    high = vec3<f32>(0.988, 0.494, 0.592);
    glow = vec3<f32>(0.545, 0.839, 1.0);
  }

  let base = select(
    mix3(low, mid, phase / 0.52),
    mix3(mid, high, (phase - 0.52) / 0.48),
    phase >= 0.52
  );
  let tip = clamp((1.0 - nutrient) * phase * 1.7 + sin(age * 0.07) * 0.04, 0.0, 1.0);
  return mix3(base, glow, tip);
}

fn packRgba(color: vec3<f32>) -> u32 {
  let r = u32(clamp(color.r, 0.0, 1.0) * 255.0);
  let g = u32(clamp(color.g, 0.0, 1.0) * 255.0);
  let b = u32(clamp(color.b, 0.0, 1.0) * 255.0);
  return r | (g << 8u) | (b << 16u) | (255u << 24u);
}

@compute @workgroup_size(${WORKGROUP_SIZE}, ${WORKGROUP_SIZE}, 1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let width = u32(params.width);
  let height = u32(params.height);
  if (id.x >= width || id.y >= height) {
    return;
  }

  let x = i32(id.x);
  let y = i32(id.y);
  let index = idx(x, y);
  let cell = stateIn[index];
  let left = stateIn[idx(x - 1, y)];
  let right = stateIn[idx(x + 1, y)];
  let up = stateIn[idx(x, y - 1)];
  let down = stateIn[idx(x, y + 1)];

  let phase = cell.x;
  let nutrient = cell.y;
  let age = cell.z;
  let lapPhase = left.x + right.x + up.x + down.x - phase * 4.0;
  let lapNutrient = left.y + right.y + up.y + down.y - nutrient * 4.0;
  let grad = vec2<f32>((right.x - left.x) * 0.5, (down.x - up.x) * 0.5);
  let angle = atan2(grad.y, grad.x);
  let anis = 1.0 + params.anisotropy * cos(params.symmetry * angle);
  let front = phase * (1.0 - phase);
  let drive = phase - 0.5 + params.undercooling + (nutrient - 0.52) * 0.72;
  let stochastic = (hashNoise(f32(x), f32(y), params.time) - 0.5) * params.noise * (1.0 - phase);
  let delta = params.dt * params.mobility * (anis * lapPhase + front * drive + stochastic);
  let nextPhase = clamp(phase + delta, 0.0, 1.0);
  let growth = max(0.0, nextPhase - phase);
  let nextNutrient = clamp(
    nutrient + params.dt * (params.diffusion * lapNutrient - growth * 0.42),
    0.0,
    1.0
  );
  let nextAge = select(age + nextPhase * 0.03, params.time, age <= 0.0 && nextPhase > 0.18);

  stateOut[index] = vec4<f32>(nextPhase, nextNutrient, nextAge, 0.0);
  colors[index] = packRgba(paletteColor(nextPhase, nextNutrient, nextAge));

  if (nextPhase > 0.2) {
    atomicAdd(&stats[0], 1u);
  }
  atomicAdd(&stats[1], u32(growth * 1000000.0));
}
`;

export class WebGpuPhaseFieldEngine implements SimulationEngine {
  readonly mode = 'webgpu' as const;

  private device: GPUDevice | undefined;
  private pipeline: GPUComputePipeline | undefined;
  private paramsBuffer: GPUBuffer | undefined;
  private statsBuffer: GPUBuffer | undefined;
  private statsReadBuffer: GPUBuffer | undefined;
  private colorBuffer: GPUBuffer | undefined;
  private colorReadBuffer: GPUBuffer | undefined;
  private stateBuffers: GPUBuffer[] = [];
  private bindGroups: GPUBindGroup[] = [];
  private size = 0;
  private frame = 0;
  private ping = 0;

  static isSupported() {
    return 'gpu' in navigator && Boolean(navigator.gpu);
  }

  static async create() {
    if (!WebGpuPhaseFieldEngine.isSupported()) {
      throw new Error('WebGPU is not available in this browser.');
    }

    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: 'high-performance'
    });

    if (!adapter) {
      throw new Error('No WebGPU adapter was found.');
    }

    const device = await adapter.requestDevice();
    const engine = new WebGpuPhaseFieldEngine();
    engine.device = device;
    engine.pipeline = device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: device.createShaderModule({ code: shader }),
        entryPoint: 'main'
      }
    });

    return engine;
  }

  reset(settings: SimulationSettings) {
    if (!this.device || !this.pipeline) {
      throw new Error('WebGPU engine is not initialized.');
    }

    this.disposeBuffers();
    this.size = settings.gridSize;
    this.frame = 0;
    this.ping = 0;

    const stateBytes = this.size * this.size * STATE_STRIDE_BYTES;
    const colorBytes = this.size * this.size * 4;
    const initial = createInitialField(settings);

    this.stateBuffers = [0, 1].map(() =>
      this.device!.createBuffer({
        size: stateBytes,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      })
    );
    this.device.queue.writeBuffer(this.stateBuffers[0], 0, initial);
    this.device.queue.writeBuffer(this.stateBuffers[1], 0, initial);

    this.colorBuffer = this.device.createBuffer({
      size: colorBytes,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    });
    this.colorReadBuffer = this.device.createBuffer({
      size: colorBytes,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
    this.statsBuffer = this.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
    });
    this.statsReadBuffer = this.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
    this.paramsBuffer = this.device.createBuffer({
      size: 48,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    this.bindGroups = [0, 1].map((index) =>
      this.device!.createBindGroup({
        layout: this.pipeline!.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: this.stateBuffers[index] } },
          { binding: 1, resource: { buffer: this.stateBuffers[1 - index] } },
          { binding: 2, resource: { buffer: this.colorBuffer! } },
          { binding: 3, resource: { buffer: this.statsBuffer! } },
          { binding: 4, resource: { buffer: this.paramsBuffer! } }
        ]
      })
    );
  }

  async step(settings: SimulationSettings): Promise<SimulationFrame> {
    if (
      !this.device ||
      !this.pipeline ||
      !this.paramsBuffer ||
      !this.colorBuffer ||
      !this.colorReadBuffer ||
      !this.statsBuffer ||
      !this.statsReadBuffer
    ) {
      this.reset(settings);
    }
    if (this.size !== settings.gridSize) {
      this.reset(settings);
    }

    const device = this.device!;
    const colorBytes = this.size * this.size * 4;
    const params = new Float32Array([
      this.size,
      this.size,
      settings.dt,
      settings.anisotropy,
      settings.undercooling,
      settings.mobility,
      settings.diffusion,
      settings.noise,
      settings.symmetry,
      this.frame,
      PALETTE_INDEX[settings.palette],
      0
    ]);

    device.queue.writeBuffer(this.paramsBuffer!, 0, params);
    device.queue.writeBuffer(this.statsBuffer!, 0, new Uint32Array([0, 0, 0, 0]));

    const commandEncoder = device.createCommandEncoder();
    const pass = commandEncoder.beginComputePass();
    pass.setPipeline(this.pipeline!);
    pass.setBindGroup(0, this.bindGroups[this.ping]);
    pass.dispatchWorkgroups(
      Math.ceil(this.size / WORKGROUP_SIZE),
      Math.ceil(this.size / WORKGROUP_SIZE)
    );
    pass.end();
    commandEncoder.copyBufferToBuffer(this.colorBuffer!, 0, this.colorReadBuffer!, 0, colorBytes);
    commandEncoder.copyBufferToBuffer(this.statsBuffer!, 0, this.statsReadBuffer!, 0, 16);
    device.queue.submit([commandEncoder.finish()]);

    await Promise.all([
      this.colorReadBuffer!.mapAsync(GPUMapMode.READ),
      this.statsReadBuffer!.mapAsync(GPUMapMode.READ)
    ]);

    const pixels = new Uint8Array(this.colorReadBuffer!.getMappedRange().slice(0));
    const stats = new Uint32Array(this.statsReadBuffer!.getMappedRange().slice(0));
    this.colorReadBuffer!.unmap();
    this.statsReadBuffer!.unmap();

    this.frame += 1;
    this.ping = 1 - this.ping;

    return {
      width: this.size,
      height: this.size,
      pixels,
      metrics: {
        activeCells: stats[0],
        growthRate: stats[1] / 1000000,
        coverage: stats[0] / (this.size * this.size),
        frame: this.frame
      }
    };
  }

  dispose() {
    this.disposeBuffers();
    this.device?.destroy();
    this.device = undefined;
  }

  private disposeBuffers() {
    for (const buffer of this.stateBuffers) {
      buffer.destroy();
    }
    this.paramsBuffer?.destroy();
    this.statsBuffer?.destroy();
    this.statsReadBuffer?.destroy();
    this.colorBuffer?.destroy();
    this.colorReadBuffer?.destroy();
    this.stateBuffers = [];
    this.bindGroups = [];
    this.paramsBuffer = undefined;
    this.statsBuffer = undefined;
    this.statsReadBuffer = undefined;
    this.colorBuffer = undefined;
    this.colorReadBuffer = undefined;
  }
}
