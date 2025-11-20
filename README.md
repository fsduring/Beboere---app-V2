# Beboere App V2 (Next.js MVP)

Full-stack Next.js 14 app with Prisma + PostgreSQL implementing ADMIN / BEBOER / VIEWER flows from `docs/architecture.md`.

## Requirements
- Node.js 18+
- PostgreSQL database

## Environment variables
Create `.env` with:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

## Setup
1. Install dependencies
```
npm install
```
2. Generate Prisma client and migrate
```
npx prisma migrate dev
npx prisma db seed
```
3. Run dev server
```
npm run dev
```

## Deploy to Vercel
- Add env vars `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` in Vercel dashboard.
- Run `npx prisma generate` during build (Vercel handles via postinstall).
- Set `prisma generate` as part of build step if needed.

## Seed data
The seed script creates:
- ADMIN user: admin@example.com / Password123!
- VIEWER user: viewer@example.com / Password123!
- BEBOER user: beboer@example.com / Password123! linked to Unit A with house code `HOUSE-123`.
