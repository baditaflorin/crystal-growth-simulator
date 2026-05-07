# Security Policy

## Supported Versions

The latest tagged release and the `main` branch receive security fixes.

## Reporting a Vulnerability

Please report vulnerabilities privately by emailing the repository owner. Do not open a public issue for secrets, supply-chain problems, or browser security concerns.

## Baseline

- No runtime backend.
- No frontend secrets.
- No authentication.
- No analytics by default.
- Local hooks run `gitleaks protect --staged` when gitleaks is installed.
