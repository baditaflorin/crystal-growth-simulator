# 0006 WASM Modules And C++ Reference

## Status

Accepted

## Context

The requested concept mentions C++ phase-field simulation. Browsers execute WebGPU compute as WGSL, not C++. Emscripten is not available in the current local toolchain.

## Decision

Ship the production browser simulation as a WGSL WebGPU compute kernel, with a TypeScript CPU fallback and a C++ reference kernel under `src/simulation/cpp/` for validation and future WASM work.

## Consequences

The simulator is fully usable from GitHub Pages. The C++ file documents the numerical model but is not part of the default Pages build.

## Alternatives Considered

- Pretending C++ can run as a WebGPU kernel was rejected.
- Adding a mandatory WASM toolchain was rejected because GitHub Pages cannot provide required headers for threaded WASM and the local toolchain lacks Emscripten.
