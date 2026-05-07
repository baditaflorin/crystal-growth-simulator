# Contributing

Thanks for helping improve Crystal Growth Simulator.

## Local Setup

```bash
npm install
make install-hooks
make dev
```

## Workflow

- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ops:`, or `data:`.
- Keep changes focused and include tests for behavior changes.
- Run `make lint`, `make test`, and `make smoke` before pushing.
- Do not commit secrets, real `.env` files, private keys, generated logs, or unrelated build artifacts.

## Pages Build

GitHub Pages serves `main:/docs`. The `docs/` directory intentionally contains both hand-written project documentation and the generated static frontend.
