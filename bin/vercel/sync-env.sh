#!/bin/bash

doppler secrets download --no-file --format env > .env

set -euo pipefail

ENV_FILE=".env"

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "❌ VERCEL_TOKEN not set. Aborting."
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ $ENV_FILE not found."
  exit 1
fi

echo "🚀 Syncing .env variables to Vercel preview environment..."

while IFS='=' read -r key raw_value || [[ -n "$key" ]]; do
  # Skip blank lines or lines starting with #
  [[ -z "$key" || "$key" =~ ^# ]] && continue

  # Handle multiline values safely (read does not trim \n automatically)
  value=$(echo -n "$raw_value" | sed -e 's/^["'"'"']//' -e 's/["'"'"']$//' | tr -d '\n' | xargs)

  echo "🔑 Syncing $key"
  vercel env rm "$key" preview --yes --token="$VERCEL_TOKEN"
  vercel env add "$key" preview --token="$VERCEL_TOKEN" <<< "$value"

done < "$ENV_FILE"

echo "✅ Done syncing all variables from .env to Vercel (preview)."

echo "Removing .env"

rm .env