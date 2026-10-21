#!/bin/bash
set -e
cd "$(dirname "$0")/Lotus_Adversity_Game"
[ ! -d node_modules ] && ~/.bun/bin/bun install
export PATH="$HOME/.bun/bin:$PATH"
echo "Starting The Wheel — Vite dev server on http://localhost:5173..."
exec bun run dev
