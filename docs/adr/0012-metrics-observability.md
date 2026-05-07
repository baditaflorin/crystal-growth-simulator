# 0012 Metrics And Observability

## Status

Accepted

## Context

The app has no backend and should preserve user privacy.

## Decision

Do not include analytics in v1. Surface local runtime metrics in the UI: FPS, growth rate, active pixels, and backend mode.

## Consequences

There is no usage tracking, no PII collection, and no Prometheus setup.

## Alternatives Considered

Plausible analytics was considered and rejected because usage insight is not required for v1.
