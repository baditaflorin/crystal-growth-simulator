# 0011 Logging Strategy

## Status

Accepted

## Context

Mode A has no server logs. Browser console noise should be minimal in production.

## Decision

Log only initialization failures or unsupported browser diagnostics. User-facing errors appear in the UI status panel.

## Consequences

Production users are not flooded with console messages, and support issues still have clear failure states.

## Alternatives Considered

Verbose simulation logging was rejected because it hurts performance and clarity.
