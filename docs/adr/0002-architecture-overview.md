# 0002 Architecture Overview

## Status

Accepted

## Context

The app should feel like a live scientific instrument, not a landing page. Compute, rendering, audio, and controls need clear boundaries.

## Decision

Split the frontend into feature modules:

- `features/simulation`: presets, WebGPU engine, CPU fallback, shared types
- `features/rendering`: Three.js renderer
- `features/audio`: Web Audio sonification
- `features/ui`: controls, status, metric panels
- `lib`: persistence and build metadata helpers

## Consequences

The simulation can be tested independently from the UI. Rendering and audio are lazily initialized after user action.

## Alternatives Considered

A single app file was rejected because it would make testing and later WebGPU/WASM changes harder.
