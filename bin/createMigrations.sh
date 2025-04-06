#!/bin/bash
#
# createMigrations.sh - Script to create migration SQL files for dmsconnect
#
# This script allows developers to create migration SQL files without actually affecting the database. The created migration files should be versioned in git.
# use migrate.sh to apply the generated migrations to the database.
if [ "$NODE_ENV" = "production" ];then
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
yarn prisma migrate dev --create-only