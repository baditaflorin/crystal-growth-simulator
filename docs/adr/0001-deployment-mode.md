# 0001 Deployment Mode

## Status

Accepted

## Context

The simulator needs browser rendering, browser audio, and browser-side compute. It does not need authentication, cross-device persistence, secrets, mutations, or server-side data.

## Decision

Use Mode A: Pure GitHub Pages. The app is a static Vite build committed to `docs/` and published from `main:/docs`.

## Consequences

- No runtime backend, Docker, nginx, or server deployment is needed.
- All simulation work runs in the browser with WebGPU and a TypeScript CPU fallback.
- GitHub Pages header limitations mean no threaded WASM or SharedArrayBuffer dependency in v1.

## Alternatives Considered

- Mode B: rejected because there is no static data pipeline.
- Mode C: rejected because there are no runtime secrets, writes, or APIs.
