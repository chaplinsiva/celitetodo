#!/usr/bin/env bash
set -e

echo "=========================================="
echo " Celite Manager - Pre-Deployment Check"
echo "=========================================="

echo "[1/3] Checking environment variables..."
if [ -f .env.local ]; then
    echo "  ✔ Found .env.local"
else
    echo "  ⚠ Warning: .env.local file not found!"
fi

echo "[2/3] Checking Git status..."
git status --short

echo "[3/3] Running production build..."
npm run build

echo "=========================================="
echo " ✔ All pre-deployment checks passed!"
echo "=========================================="
