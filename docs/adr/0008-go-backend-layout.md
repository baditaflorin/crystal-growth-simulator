# 0008 Go Backend Layout

## Status

Accepted

## Context

The bootstrap template describes Go layout for Modes B and C.

## Decision

Skip Go backend layout entirely because this is Mode A.

## Consequences

No `cmd/`, `internal/`, Dockerfile, runtime API, or Go module is created.

## Alternatives Considered

Adding an unused Go skeleton was rejected because it would imply operational scope the app does not have.
