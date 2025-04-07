#!/bin/bash

#Check if we can directly download a .env from doppler
doppler secrets download --no-file --format json | \
  jq -r 'to_entries[] | "\(.key)=\(.value)"' | \
  while IFS='=' read -r key value; do 
    echo "$value" | vercel env add "$key" preview --token="$VERCEL_TOKEN"
  done