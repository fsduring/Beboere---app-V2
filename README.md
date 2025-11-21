# Beboere App V2 (Next.js MVP)

Full-stack Next.js 14 app with Prisma + PostgreSQL implementing ADMIN / BEBOER / VIEWER flows from `docs/architecture.md`.
Produkt- og UX-oversigt: se `docs/PROJEKT_DOKUMENTATION.md` for den fulde V7-prototypebeskrivelse (token-login, senior mode, ZIP-eksport m.m.).

## Requirements
- Node.js 18+
- PostgreSQL database

## Environment variables
Copy `.env.example` to `.env` and update the values:
```
cp .env.example .env
```
Required keys:
- `DATABASE_URL`: PostgreSQL connection string (works with Vercel Postgres, Neon, Supabase, etc.)
- `NEXTAUTH_SECRET`: Random string for session signing
- `NEXTAUTH_URL`: Your site URL (e.g. `http://localhost:3000` or `https://<your-vercel-domain>`)

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
1. Connect the repo to Vercel.
2. Add the env vars `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` in the Vercel dashboard. If you use **Vercel Postgres**, you can skip defining `DATABASE_URL` manually—the build script automatically falls back to `POSTGRES_PRISMA_URL` provided by the integration.
3. Vercel will run the custom build command from `vercel.json`: `npm run vercel-build` (which applies migrations, seeds the DB, and builds the app).
4. Ensure your database user can run DDL for `prisma migrate deploy`.
5. After deploy, login with the seeded accounts below.

## Seed data
The seed script creates:
- ADMIN user: admin@example.com / Password123!
- VIEWER user: viewer@example.com / Password123!
- BEBOER user: beboer@example.com / Password123! linked to Unit A with house code `HOUSE-123`.
