# Architecture

Crystal Growth Simulator is Mode A: a pure GitHub Pages app with no runtime backend.

```mermaid
C4Container
  title Container Diagram
  Person(user, "Explorer")
  System_Boundary(pages, "GitHub Pages static boundary") {
    Container(shell, "App Shell", "React + TypeScript + Vite", "Preset controls, parameter panels, accessibility, routing-free PWA")
    Container(sim, "Simulation Engine", "WebGPU WGSL + TypeScript fallback", "Phase-field-inspired phi and concentration updates")
    Container(renderer, "Renderer", "Three.js", "DataTexture plane, palette shader, camera framing")
    Container(audio, "Audio Engine", "Web Audio", "Growth-rate oscillator, filtered noise, dynamics")
    Container(storage, "Preference Store", "localStorage", "Last preset and user settings")
  }
  System_Ext(github, "GitHub", "Repository and Pages hosting")
  System_Ext(paypal, "PayPal", "Optional donation link")
  Rel(user, shell, "Uses")
  Rel(shell, sim, "Configures and steps")
  Rel(sim, renderer, "Provides color frames and growth metrics")
  Rel(sim, audio, "Provides rhythm metrics")
  Rel(shell, storage, "Persists local settings")
  Rel(shell, github, "Links")
  Rel(shell, paypal, "Links")
```

The build output is committed under `docs/` so GitHub Pages can publish from `main:/docs`. The app avoids COOP/COEP requirements by not using shared memory or threaded WASM.
