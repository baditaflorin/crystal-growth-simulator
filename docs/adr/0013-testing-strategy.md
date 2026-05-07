# 0013 Testing Strategy

## Status

Accepted

## Context

The simulator has pure logic, browser APIs, and visual smoke risk.

## Decision

Use Vitest for unit tests, Testing Library for UI tests, and Playwright for smoke/e2e. `make smoke` builds the Pages output, serves `docs/`, and checks the happy path.

## Consequences

Tests remain local and fast enough for hooks. WebGPU-specific behavior is guarded by smoke tests that tolerate unsupported headless browsers by checking fallback states.

## Alternatives Considered

GitHub Actions was rejected by project constraint.
