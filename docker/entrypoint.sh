#!/bin/sh
set -e

echo "Running database migrations..."
npm run db:push || true

echo "Starting API server..."
npm run start:api
