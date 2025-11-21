#!/usr/bin/env sh
set -e

# Prefer DATABASE_URL but allow Vercel Postgres' POSTGRES_PRISMA_URL fallback
: "${DATABASE_URL:=$POSTGRES_PRISMA_URL}"

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL or POSTGRES_PRISMA_URL must be set for Prisma" >&2
  exit 1
fi

export DATABASE_URL

prisma migrate deploy
prisma db seed
next build
