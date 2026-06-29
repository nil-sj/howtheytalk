#!/bin/bash
# TalkNotes - PostgreSQL Setup Script
# Run this ONCE to create the database and user in your shared PostgreSQL container.
#
# Usage:
#   1. Copy .env.example to .env and fill in your values
#   2. Run: bash scripts/setup-database.sh
#
# Requirements: your .env file must be filled in first.

set -e

# Load .env
if [ ! -f .env ]; then
  echo "❌  .env file not found. Copy .env.example to .env and fill it in first."
  exit 1
fi
source .env

# Detect your postgres container name
# Update POSTGRES_CONTAINER if yours is named differently
POSTGRES_CONTAINER="${POSTGRES_CONTAINER_NAME:-postgres-postgres-1}"

echo "🔍  Looking for PostgreSQL container: $POSTGRES_CONTAINER"
if ! docker ps --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER}$"; then
  echo "❌  Container '$POSTGRES_CONTAINER' not found or not running."
  echo "    Running containers: $(docker ps --format '{{.Names}}' | tr '\n' ' ')"
  exit 1
fi

echo "✅  Found container: $POSTGRES_CONTAINER"
echo ""
echo "📦  Creating database and user..."
echo "    Database : $POSTGRES_DB"
echo "    User     : $POSTGRES_USER"
echo ""

# Run SQL as the postgres superuser inside the container
docker exec -i "$POSTGRES_CONTAINER" psql -U postgres << EOF

-- Create user (skip if exists)
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${POSTGRES_USER}') THEN
    CREATE USER ${POSTGRES_USER} WITH PASSWORD '${POSTGRES_PASSWORD}';
    RAISE NOTICE 'User ${POSTGRES_USER} created.';
  ELSE
    RAISE NOTICE 'User ${POSTGRES_USER} already exists — skipping.';
  END IF;
END
\$\$;

-- Create database (skip if exists)
SELECT 'CREATE DATABASE ${POSTGRES_DB} OWNER ${POSTGRES_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${POSTGRES_DB}')\gexec

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_USER};

\echo 'Done.'
EOF

echo ""
echo "✅  Database setup complete!"
echo ""
echo "Next steps:"
echo "  1. Start TalkNotes:  docker compose up -d"
echo "  2. Open installer:   http://localhost:9022"
echo "  3. Choose profile:   Standard"
echo "  4. Database type:    PostgreSQL"
echo "     Host:             $POSTGRES_HOST"
echo "     Database:         $POSTGRES_DB"
echo "     Username:         $POSTGRES_USER"
echo "     Password:         (from your .env)"
