# 0015 Deployment Topology

## Status

Accepted

## Context

Mode C deployment artifacts are unnecessary for a static Pages app.

## Decision

Use GitHub Pages only. No `deploy/` directory, Docker Compose, nginx, TLS config, or server runbook is included.

## Consequences

Deployment is a push to `main`; rollback is a git revert.

## Alternatives Considered

A Docker backend was rejected because there is no API.
