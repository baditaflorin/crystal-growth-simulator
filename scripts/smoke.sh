#!/usr/bin/env bash
set -euo pipefail

npm run build
TMP_DIR="$(mktemp -d)"
mkdir -p "$TMP_DIR/crystal-growth-simulator"
cp -R docs/. "$TMP_DIR/crystal-growth-simulator/"

npx http-server "$TMP_DIR" -p 4175 -c-1 >/tmp/crystal-growth-smoke.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true; rm -rf "$TMP_DIR"' EXIT

for _ in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:4175/crystal-growth-simulator/ >/dev/null 2>&1; then
    break
  fi
  sleep 0.2
done

npx playwright test --config=playwright.config.ts
