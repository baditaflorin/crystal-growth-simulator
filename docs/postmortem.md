# Postmortem

## What Was Built

Mode A static GitHub Pages app with WebGPU compute, Three.js rendering, Web Audio sonification, presets, local settings, PWA support, local hooks, tests, smoke checks, and Pages documentation.

## Was Mode A Correct?

Yes. The v1 feature set needs browser compute, browser audio, browser rendering, and local preferences only. A runtime backend would add operational load without improving the experience.

## What Worked

- WebGPU fits the simulation step well.
- Three.js keeps rendering familiar and portable.
- The static Pages boundary keeps deployment simple.

## What Did Not Work

- Browsers do not execute C++ directly as WebGPU kernels. The production kernel is WGSL, with C++ retained as a reference implementation.
- GitHub Pages cannot send COOP/COEP headers, so v1 avoids threaded WASM and shared-memory assumptions.

## Surprises

GPU readback into a Three.js texture is simpler to ship broadly than direct WebGPU texture interop with Three.js, though it has performance costs.

## Accepted Tech Debt

- The CPU fallback is intentionally lower resolution than the WebGPU path.
- The C++ reference kernel is not compiled into WASM in v1 because Emscripten is not part of the local toolchain.
- The visual palette is procedural rather than asset-authored.

## Next Improvements

1. Add a WASM build path when Emscripten is available.
2. Replace readback with direct WebGPU rendering when Three.js WebGPU stabilizes further.
3. Add exportable image/video captures for teaching and sharing.

## Time Spent vs Estimate

Estimated: one focused implementation session.

Actual: one focused implementation session.
