import {
  CircleGauge,
  Github,
  Heart,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CrystalAudioEngine } from '../features/audio/crystalAudio';
import { createCrystalRenderer, type CrystalRenderer } from '../features/rendering/threeRenderer';
import {
  CpuPhaseFieldEngine,
  PRESETS,
  WebGpuPhaseFieldEngine,
  type SimulationEngine,
  type SimulationMetrics
} from '../features/simulation';
import { buildInfo } from '../lib/buildInfo';
import { useCrystalStore } from './store';

const initialMetrics: SimulationMetrics = {
  fps: 0,
  activeCells: 0,
  growthRate: 0,
  coverage: 0,
  frame: 0
};

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

export function App() {
  const { presetId, settings, setPreset, updateSettings } = useCrystalStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<CrystalRenderer | null>(null);
  const engineRef = useRef<SimulationEngine | null>(null);
  const audioRef = useRef<CrystalAudioEngine | null>(null);
  const settingsRef = useRef(settings);
  const animationRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const lastFrameTimeRef = useRef(performance.now());
  const [isRunning, setIsRunning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [status, setStatus] = useState('Ready');
  const [mode, setMode] = useState<'webgpu' | 'cpu' | 'pending'>('pending');
  const [metrics, setMetrics] = useState(initialMetrics);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    function handleResize() {
      rendererRef.current?.resize();
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return () => {
      runningRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      rendererRef.current?.dispose();
      engineRef.current?.dispose();
      audioRef.current?.dispose();
    };
  }, []);

  const renderLoop = useCallback(async () => {
    if (!runningRef.current || !engineRef.current || !rendererRef.current) {
      return;
    }

    try {
      const frame = await engineRef.current.step(settingsRef.current);
      const now = performance.now();
      const delta = Math.max(1, now - lastFrameTimeRef.current);
      lastFrameTimeRef.current = now;
      const nextMetrics = {
        ...frame.metrics,
        fps: 1000 / delta
      };
      rendererRef.current.update(frame);
      audioRef.current?.update(nextMetrics);
      setMetrics(nextMetrics);
      animationRef.current = requestAnimationFrame(renderLoop);
    } catch (error) {
      runningRef.current = false;
      setIsRunning(false);
      setStatus(error instanceof Error ? error.message : 'Simulation stopped');
    }
  }, []);

  const ensureRuntime = useCallback(async () => {
    if (!canvasRef.current) {
      throw new Error('Canvas is not mounted.');
    }

    if (!rendererRef.current) {
      rendererRef.current = await createCrystalRenderer(canvasRef.current);
    }

    if (!engineRef.current) {
      try {
        const engine = await WebGpuPhaseFieldEngine.create();
        engine.reset(settingsRef.current);
        engineRef.current = engine;
        setMode('webgpu');
      } catch (error) {
        const engine = new CpuPhaseFieldEngine();
        engine.reset(settingsRef.current);
        engineRef.current = engine;
        setMode('cpu');
        setStatus(error instanceof Error ? 'CPU fallback active' : 'CPU fallback active');
      }
    }

    if (!audioRef.current) {
      audioRef.current = new CrystalAudioEngine();
    }
  }, []);

  const start = useCallback(async () => {
    if (runningRef.current || isStarting) {
      return;
    }

    setIsStarting(true);
    setStatus('Starting');

    try {
      await ensureRuntime();
      if (soundEnabled) {
        await audioRef.current?.start();
      }
      runningRef.current = true;
      setIsRunning(true);
      setStatus('Growing');
      lastFrameTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(renderLoop);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not start');
    } finally {
      setIsStarting(false);
    }
  }, [ensureRuntime, isStarting, renderLoop, soundEnabled]);

  const pause = useCallback(async () => {
    runningRef.current = false;
    setIsRunning(false);
    setStatus('Paused');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    await audioRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    engineRef.current?.reset(settingsRef.current);
    setMetrics(initialMetrics);
    setStatus(isRunning ? 'Growing' : 'Ready');
  }, [isRunning]);

  const toggleSound = useCallback(async () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (!audioRef.current || !isRunning) {
      return;
    }
    if (next) {
      await audioRef.current.start();
    } else {
      await audioRef.current.stop();
    }
  }, [isRunning, soundEnabled]);

  const selectedPreset = PRESETS.find((preset) => preset.id === presetId) ?? PRESETS[0];

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Snowflake size={22} />
          </span>
          <div>
            <h1>Crystal Growth Simulator</h1>
            <span>{selectedPreset.name}</span>
          </div>
        </div>

        <nav className="top-actions" aria-label="Project links">
          <a href={buildInfo.repoUrl} target="_blank" rel="noreferrer" title="Star on GitHub">
            <Github size={18} />
            <span>Star</span>
          </a>
          <a
            href={buildInfo.paypalUrl}
            target="_blank"
            rel="noreferrer"
            title="Support with PayPal"
          >
            <Heart size={18} />
            <span>Support</span>
          </a>
        </nav>
      </header>

      <section className="workspace" aria-label="Crystal growth workspace">
        <div className="viewport">
          <canvas ref={canvasRef} aria-label="Live crystal growth field" />
          <div className="viewport-hud" aria-live="polite">
            <span>{mode === 'pending' ? 'idle' : mode}</span>
            <span>{status}</span>
          </div>
        </div>

        <aside className="control-panel" aria-label="Simulation controls">
          <div className="transport">
            <button
              className="primary-button"
              type="button"
              onClick={isRunning ? pause : start}
              disabled={isStarting}
              title={isRunning ? 'Pause simulation' : 'Start simulation'}
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              <span>{isRunning ? 'Pause' : isStarting ? 'Starting' : 'Start'}</span>
            </button>
            <button type="button" onClick={reset} title="Reset growth field">
              <RotateCcw size={18} />
            </button>
            <button type="button" onClick={toggleSound} title="Toggle sonification">
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>

          <div className="preset-tabs" role="tablist" aria-label="Crystal presets">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                role="tab"
                aria-selected={preset.id === presetId}
                className={preset.id === presetId ? 'active' : ''}
                onClick={() => {
                  setPreset(preset.id);
                  window.setTimeout(reset, 0);
                }}
              >
                {preset.shortName}
              </button>
            ))}
          </div>

          <section className="metric-grid" aria-label="Runtime metrics">
            <Metric icon={<CircleGauge size={16} />} label="FPS" value={metrics.fps.toFixed(0)} />
            <Metric
              icon={<Sparkles size={16} />}
              label="Growth"
              value={metrics.growthRate.toFixed(3)}
            />
            <Metric label="Cells" value={formatNumber(metrics.activeCells)} />
            <Metric label="Coverage" value={formatPercent(metrics.coverage)} />
          </section>

          <section className="sliders" aria-label="Phase-field parameters">
            <h2>
              <SlidersHorizontal size={16} />
              Parameters
            </h2>
            <SelectControl
              label="Resolution"
              value={settings.gridSize}
              onChange={(value) => updateSettings({ gridSize: Number(value) })}
              options={[
                { value: 256, label: '256' },
                { value: 384, label: '384' },
                { value: 512, label: '512' }
              ]}
            />
            <RangeControl
              label="Anisotropy"
              min={0}
              max={0.4}
              step={0.01}
              value={settings.anisotropy}
              onChange={(value) => updateSettings({ anisotropy: value })}
            />
            <RangeControl
              label="Undercooling"
              min={0.05}
              max={0.5}
              step={0.01}
              value={settings.undercooling}
              onChange={(value) => updateSettings({ undercooling: value })}
            />
            <RangeControl
              label="Diffusion"
              min={0.02}
              max={0.5}
              step={0.01}
              value={settings.diffusion}
              onChange={(value) => updateSettings({ diffusion: value })}
            />
            <RangeControl
              label="Mobility"
              min={0.2}
              max={1.2}
              step={0.02}
              value={settings.mobility}
              onChange={(value) => updateSettings({ mobility: value })}
            />
            <RangeControl
              label="Noise"
              min={0}
              max={0.16}
              step={0.005}
              value={settings.noise}
              onChange={(value) => updateSettings({ noise: value })}
            />
            <RangeControl
              label="Symmetry"
              min={3}
              max={8}
              step={1}
              value={settings.symmetry}
              onChange={(value) => updateSettings({ symmetry: Math.round(value) })}
            />
          </section>
        </aside>
      </section>

      <footer className="footer">
        <span>v{buildInfo.version}</span>
        <span>commit {buildInfo.commit}</span>
        <span>{new Date(buildInfo.builtAt).toLocaleDateString()}</span>
        <a href={buildInfo.repoUrl} target="_blank" rel="noreferrer">
          https://github.com/baditaflorin/crystal-growth-simulator
        </a>
        <a href={buildInfo.paypalUrl} target="_blank" rel="noreferrer">
          PayPal
        </a>
      </footer>
    </main>
  );
}

interface MetricProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

function Metric({ icon, label, value }: MetricProps) {
  return (
    <div className="metric">
      <span>
        {icon}
        {label}
      </span>
      <strong>{value}</strong>
    </div>
  );
}

interface RangeControlProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

function RangeControl({ label, min, max, step, value, onChange }: RangeControlProps) {
  return (
    <label className="range-control">
      <span>
        {label}
        <output>{value.toFixed(step >= 1 ? 0 : 2)}</output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

interface SelectControlProps {
  label: string;
  value: number;
  options: { value: number; label: string }[];
  onChange: (value: string) => void;
}

function SelectControl({ label, value, options, onChange }: SelectControlProps) {
  return (
    <label className="select-control">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.currentTarget.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
