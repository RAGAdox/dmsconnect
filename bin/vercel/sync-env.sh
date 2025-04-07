#!/bin/bash

doppler secrets download --no-file --format json | \
  jq -r 'to_entries[] | "\(.key)=\(.value)"' | \
  while IFS='=' read -r key value; do
    vercel env add "$key" preview --token="$VERCEL_TOKEN" <<< "$value"
  done