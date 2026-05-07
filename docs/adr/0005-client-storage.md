# 0005 Client Storage

## Status

Accepted

## Context

Users benefit from returning to their last preset and control values. Cross-device sync is not required.

## Decision

Use `localStorage` through a small validated helper. Store only preset and numeric control settings.

## Consequences

The app remains private and offline-friendly. Bad or stale stored values are discarded with zod validation.

## Alternatives Considered

IndexedDB and OPFS were rejected as unnecessary for tiny preferences.
