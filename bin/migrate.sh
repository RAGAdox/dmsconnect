#!/bin/bash
#
# migrate.sh - Migration script for dmsconnect
#
# This script sets up the database and performs necessary migration steps.

set -a
if [ "$NODE_ENV" = "production" ]; then
  echo "Production environment detected. Running migration steps..."
  # Add production-specific migration commands here
  source .env.production
  
else
  echo "Non-production environment. Sourcing environment variables..."
  if [ -f .env.local ]; then
    
    source .env.local
    
  elif [ -f .env ]; then
    source .env
  else
    echo "No environment file found."
  fi
fi
set +a

yarn prisma migrate deploy && \
yarn prisma db seed

