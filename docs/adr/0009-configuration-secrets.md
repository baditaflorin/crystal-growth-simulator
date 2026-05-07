# 0009 Configuration And Secrets

## Status

Accepted

## Context

The frontend must never contain secrets.

## Decision

Use build-time constants for public metadata only: version, commit, build date, repository URL, and PayPal URL. Commit `.env.example` with placeholders and gitignore real `.env*` files.

## Consequences

No secret management service is needed. Local hooks run gitleaks when installed.

## Alternatives Considered

Runtime configuration endpoints were rejected because there is no backend.
