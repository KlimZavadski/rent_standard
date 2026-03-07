#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

[ -x ./node_modules/.bin/vite ] || npm install
./node_modules/.bin/vite build
