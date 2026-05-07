# 0003 Frontend Framework And Tooling

## Status

Accepted

## Context

The project needs a strict TypeScript UI, quick local dev, static builds, and maintainable controls.

## Decision

Use React 18, Vite, TypeScript strict mode, zustand for small local state, zod for config validation, Three.js for rendering, and Web Audio directly.

## Consequences

Vite gives fast builds and simple GitHub Pages base-path support. Three.js is lazy-loaded so initial payload stays focused on the shell.

## Alternatives Considered

Vanilla TypeScript was smaller but would make the control surface and tests more brittle. A server-rendered framework was unnecessary for a static simulator.
