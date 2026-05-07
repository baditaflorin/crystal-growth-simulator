# 0014 Error Handling Conventions

## Status

Accepted

## Context

Browser API initialization can fail due to missing WebGPU, denied audio, or lost devices.

## Decision

Use typed result states in the app store. Show clear UI messages and provide CPU fallback when WebGPU is unavailable. Never throw uncaught initialization errors from user actions.

## Consequences

Unsupported browsers degrade gracefully.

## Alternatives Considered

Hard failing without fallback was rejected because education users may open the site on varied devices.
