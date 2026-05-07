# 0017 Dependency Policy

## Status

Accepted

## Context

The app should rely on production-ready libraries rather than custom infrastructure.

## Decision

Use Vite, React, Three.js, zod, zustand, vite-plugin-pwa, Vitest, Playwright, ESLint, and Prettier. Avoid custom physics/rendering infrastructure beyond the focused phase-field kernels.

## Consequences

Dependencies are common and maintainable. Browser APIs are used directly where they are the platform standard: WebGPU and Web Audio.

## Alternatives Considered

Custom renderers, custom test runners, and bespoke state systems were rejected.
