# Crystal Growth Simulator

Live browser simulator for snowflake, dendrite, and coral-like crystal growth with WebGPU visuals and sonified physics.

Live site: https://baditaflorin.github.io/crystal-growth-simulator/

Repository: https://github.com/baditaflorin/crystal-growth-simulator

Support: https://www.paypal.com/paypalme/florinbadita

![Crystal Growth Simulator demo](docs/demo.png)

## What It Is

Crystal Growth Simulator is a static GitHub Pages app that runs a phase-field-inspired growth model in the browser, renders the field with Three.js, and maps growth rhythm to Web Audio. It is built for education, science communication, and visual exploration rather than scientific-grade numerical output.

## Quickstart

```bash
npm install
make install-hooks
make dev
make test
make build
```

## Architecture

```mermaid
C4Context
  title Crystal Growth Simulator
  Person(user, "Explorer", "Learns crystal growth by tuning live controls")
  System_Boundary(pages, "GitHub Pages: https://baditaflorin.github.io/crystal-growth-simulator/") {
    Container(app, "Static Vite App", "React, TypeScript", "Controls, presets, status, PWA shell")
    Container(compute, "WebGPU Compute", "WGSL", "Phase-field growth steps on GPU")
    Container(render, "Three.js Renderer", "WebGL", "Live field texture and camera")
    Container(audio, "Web Audio", "Browser API", "Sonifies growth rate and branching")
    Container(storage, "Browser Storage", "localStorage", "Stores user preferences only")
  }
  System_Ext(github, "GitHub Repository", "Source, issues, stars")
  System_Ext(paypal, "PayPal", "Optional support link")
  Rel(user, app, "Opens and controls")
  Rel(app, compute, "Dispatches simulation steps")
  Rel(app, render, "Streams texture frames")
  Rel(app, audio, "Sends growth metrics")
  Rel(app, storage, "Saves settings")
  Rel(app, github, "Links to source/star")
  Rel(app, paypal, "Links to support")
```

More detail: docs/architecture.md

ADRs: docs/adr/

Deploy guide: docs/deploy.md

## Versioning

The page footer shows the npm package version, build commit, build timestamp, repository link, and PayPal support link.

## Checks

```bash
make lint
make test
make smoke
```

No GitHub Actions are configured. Local hooks run linting, type checks, formatting, tests, the Pages build, Playwright smoke checks, and a gitleaks scan when available.
