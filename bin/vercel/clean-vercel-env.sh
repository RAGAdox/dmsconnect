#!/bin/bash

set -e

# Ensure VERCEL_TOKEN is set
if [[ -z "$VERCEL_TOKEN" ]]; then
  echo "❌ VERCEL_TOKEN is not set."
  exit 1
fi

echo "🔍 Fetching Vercel preview environment variables..."

# Get all env variable names from the preview environment
vars=$(vercel env ls --environment preview --token="$VERCEL_TOKEN" | \
  awk '/^│/ && !/Environment/ { print $2 }' | tail -n +2)

if [[ -z "$vars" ]]; then
  echo "✅ No environment variables found for preview."
  exit 0
fi

# Remove each variable
for var in $vars; do
  echo "❌ Removing $var from preview..."
  vercel env rm "$var" preview --yes --token "$VERCEL_TOKEN"
done

echo "✅ All preview environment variables removed."