#!/bin/bash

set -a
if [ "$NODE_ENV" = "producion" ]; then
  echo "Production environment detected. This command is not ment to be run on production environment"
  exit 1;
else
  echo "Non-production environment detected. Sourcing environment variables..."
  
  if [ -f .env.local ]; then
    source .env.local
  elif [ -f .env ]; then
    source .env
  else
    echo "No environment file found."
  fi
fi
set +a

yarn prisma migrate diff \
  --to-schema-datamodel prisma/schema.prisma \
  --from-migrations prisma/migrations \
  --shadow-database-url $SHADOW_DB_URL \
  --exit-code

exit_code=$?

if [ "$exit_code" -eq 2 ]; then
  echo -e "Pending migration changes detected.Changes -"
  echo "$diff_output"
  exit 1
elif [ "$exit_code" -eq 1 ]; then
  echo -e "Unable to check migrations"
  exit 1
else
  echo "No pending migration changes."
  exit 0
fi
