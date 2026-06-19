# raise ur voice

A platform to stay informed on global conflicts and human rights crises. Read the data, discuss, and find ways to act.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Supabase** (PostgreSQL + Realtime)
- **Tailwind CSS**
- **Vercel** (hosting + cron)

## Getting started

```bash
cp .env.local.example .env.local
# fill in your keys

npm install
npm run dev
```

## Seed the database

Once `.env.local` is filled with your Supabase credentials:

```bash
npm run seed
```

## Data sources

| Source | What it provides |
|--------|-----------------|
| ACLED | Armed conflict events, fatalities |
| ReliefWeb | Humanitarian reports |
| UNHCR | Refugee & displacement statistics |

## Sync

Conflict data is refreshed automatically every Monday at 3am via a Vercel cron job hitting `POST /api/sync`.

To trigger manually:

```bash
curl -X POST https://your-domain.com/api/sync \
  -H "x-sync-secret: YOUR_SYNC_SECRET"
```
