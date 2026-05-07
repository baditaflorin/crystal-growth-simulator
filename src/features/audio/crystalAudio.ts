import type { SimulationMetrics } from '../simulation';

export class CrystalAudioEngine {
  private context: AudioContext | undefined;
  private gain: GainNode | undefined;
  private oscillator: OscillatorNode | undefined;
  private filter: BiquadFilterNode | undefined;
  private noiseSource: AudioBufferSourceNode | undefined;
  private noiseGain: GainNode | undefined;

  async start() {
    if (this.context) {
      await this.context.resume();
      return;
    }

    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.value = 0.0001;
    master.connect(context.destination);

    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 110;

    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 440;
    filter.Q.value = 7;

    const noiseGain = context.createGain();
    noiseGain.gain.value = 0.0001;

    oscillator.connect(filter);
    filter.connect(master);
    this.createNoise(context).connect(noiseGain);
    noiseGain.connect(master);
    oscillator.start();

    master.gain.linearRampToValueAtTime(0.045, context.currentTime + 0.2);

    this.context = context;
    this.gain = master;
    this.oscillator = oscillator;
    this.filter = filter;
    this.noiseGain = noiseGain;
  }

  update(metrics: SimulationMetrics) {
    if (!this.context || !this.oscillator || !this.filter || !this.noiseGain) {
      return;
    }

    const now = this.context.currentTime;
    const growth = Math.min(1, metrics.growthRate * 12);
    const coverage = Math.min(1, metrics.coverage * 3);
    const pulse = 0.5 + Math.sin(metrics.frame * 0.08) * 0.5;

    this.oscillator.frequency.setTargetAtTime(96 + growth * 320 + coverage * 140, now, 0.05);
    this.filter.frequency.setTargetAtTime(260 + growth * 2200, now, 0.08);
    this.filter.Q.setTargetAtTime(4 + pulse * 10, now, 0.12);
    this.noiseGain.gain.setTargetAtTime(0.004 + growth * 0.045, now, 0.04);
  }

  async stop() {
    if (!this.context || !this.gain) {
      return;
    }

    this.gain.gain.cancelScheduledValues(this.context.currentTime);
    this.gain.gain.linearRampToValueAtTime(0.0001, this.context.currentTime + 0.12);
    await new Promise((resolve) => window.setTimeout(resolve, 140));
    await this.context.suspend();
  }

  async dispose() {
    this.oscillator?.stop();
    this.noiseSource?.stop();
    await this.context?.close();
    this.context = undefined;
  }

  private createNoise(context: AudioContext) {
    const length = context.sampleRate * 2;
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < length; index += 1) {
      data[index] = Math.random() * 2 - 1;
    }

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.start();
    this.noiseSource = source;
    return source;
  }
}
