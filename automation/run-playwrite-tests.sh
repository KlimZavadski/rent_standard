#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

[ -x ./node_modules/.bin/playwright ] || npm install

./automation/build.sh

node ./automation/serve-dist.mjs &
SERVER_PID=$!

cleanup() {
  if kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID"
  fi
}

trap cleanup EXIT

./node_modules/.bin/wait-on http://localhost:4173
./node_modules/.bin/playwright test

