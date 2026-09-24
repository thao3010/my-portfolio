#!/usr/bin/env bash
# One-time local setup after clone (run inside WSL).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> Portfolio Builder — local setup"
echo "Project root: $ROOT"

if ! command -v node >/dev/null; then
  echo "Node.js not found. Install Node 20+ (nvm recommended), then re-run."
  exit 1
fi

if ! command -v pnpm >/dev/null; then
  echo "Installing pnpm via corepack..."
  corepack enable
  corepack prepare pnpm@9.15.9 --activate
fi

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

pnpm install
pnpm --filter @portfolio/shared build

if command -v docker >/dev/null && docker info >/dev/null 2>&1; then
  pnpm db:up
  echo "Waiting for Postgres..."
  sleep 5
  pnpm migration:run
else
  echo "Docker not running — skip db:up and migration:run."
  echo "Start Docker Desktop (WSL integration), then run: pnpm db:up && pnpm migration:run"
fi

echo ""
echo "Done. Start API: pnpm --filter @portfolio/api dev"
echo "Health: http://localhost:3847/api/v1/health"
