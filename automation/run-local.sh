#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

[ -x ./node_modules/.bin/vite ] || npm install
exec ./node_modules/.bin/vite --open
