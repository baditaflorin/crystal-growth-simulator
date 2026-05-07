# 0004 Static Data Contract

## Status

Accepted

## Context

Mode A has no external data source, but the app still exposes build metadata to the page.

## Decision

Generate `docs/version.json` at build time with:

- `version`
- `commit`
- `builtAt`
- `repository`

The UI also embeds the same values at compile time for offline use.

## Consequences

The page can show version and commit without a backend. No data freshness indicator is needed beyond build time.

## Alternatives Considered

Fetching GitHub commits at runtime was rejected as the primary source because it adds rate limits and network dependency.
