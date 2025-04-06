#!/bin/bash

# reset.sh - Script to reset the database for dmsconnect
# This script resets the database and applies all migrations from scratch and seeds the database.
# It is intended for use in non-production environments only.

if(
  [ "$NODE_ENV" = "production" ]
); then
  echo "Production environment detected. This command is not ment to be run on producion environment..."
  exit 1;
else
  echo "Non-production environment. Sourcing environment variables..."
  set -a
  if [ -f .env.local ]; then
    source .env.local
  elif [ -f .env ]; then
    source .env
  else
    echo "No environment file found."
  fi
  set +a
fi

pnpm dlx prisma migrate reset