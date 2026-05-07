#!/usr/bin/env bash
set -euo pipefail

npm run build
TMP_DIR="$(mktemp -d)"
mkdir -p "$TMP_DIR/crystal-growth-simulator"
cp -R docs/. "$TMP_DIR/crystal-growth-simulator/"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT
echo "Serving http://127.0.0.1:4174/crystal-growth-simulator/"
npx http-server "$TMP_DIR" -p 4174 -c-1
