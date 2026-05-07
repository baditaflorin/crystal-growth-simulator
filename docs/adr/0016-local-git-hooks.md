# 0016 Local Git Hooks

## Status

Accepted

## Context

The project requires local checks instead of GitHub Actions.

## Decision

Use plain `.githooks/` wired by `make install-hooks`.

Hooks:

- pre-commit: lint, typecheck, format check, gitleaks if installed
- commit-msg: Conventional Commits
- pre-push: tests, Pages build, smoke

## Consequences

Checks are transparent shell scripts and runnable manually.

## Alternatives Considered

Lefthook was considered but plain hooks are simpler for this small repo.
