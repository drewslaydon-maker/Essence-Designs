#!/bin/bash
set -e
cd "$(dirname "$0")/Lotus_Adversity_Game"
[ ! -d node_modules ] && ~/.bun/bin/bun install
export PATH="$HOME/.bun/bin:$PATH"
echo "Starting Adversity Server on http://localhost:3000..."
exec bun run dev
