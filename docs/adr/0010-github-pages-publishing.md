# 0010 GitHub Pages Publishing

## Status

Accepted

## Context

The live Pages URL is a first-class deliverable. The repository also needs hand-written docs and ADRs.

## Decision

Publish GitHub Pages from `main:/docs`. Vite builds into `docs/` with `emptyOutDir: false`; build scripts clean generated frontend files while preserving `docs/adr`, `docs/architecture.md`, `docs/deploy.md`, `docs/privacy.md`, and `docs/postmortem.md`.

The Vite base path is `/crystal-growth-simulator/`. `404.html` is copied from `index.html` for fallback behavior.

## Consequences

The Pages publish directory is committed and is not gitignored. Documentation is also browseable on Pages.

## Alternatives Considered

A `gh-pages` branch was considered but rejected because publishing from `main:/docs` makes the static deliverable visible in normal repository history.
