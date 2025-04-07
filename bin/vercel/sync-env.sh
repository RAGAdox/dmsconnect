#!/bin/bash

doppler secrets download --no-file --format json | \
  jq -r 'to_entries[] | "\(.key)=\(.value)"' | \
  while IFS='=' read -r key value; do
    trimmed_value=$(echo "$value" | xargs)
    vercel env add "$key" preview --token="$VERCEL_TOKEN" <<< "$trimmed_value"
  done