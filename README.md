# Raise ur voice

A platform to make global conflicts and human rights crises visible. Browse documented crises, read the facts, discuss with the community, submit new conflicts, and find ways to act.

**Live:** raiseurvoice.vercel.app

## What it does

- Covers active crises with detailed summaries, key facts, statistics, images, and verified sources
- Anyone can submit a new conflict. The system auto-fills information from Wikipedia, ReliefWeb, UNHCR, and Google News
- New crises are discovered automatically every week from ReliefWeb disaster alerts
- Threaded discussions under each conflict with a like system
- Suggests concrete action links (donations, petitions, NGO support)
- Image upload from your device or by URL
- Built-in page translation via Google Translate
- Responsive design that works on all devices

## Getting started

```bash
git clone https://github.com/Mac-Aurel/raiseurvoice.git
cd raiseurvoice
npm install
cp .env.local.example .env.local
```

Fill in your Supabase credentials and secrets in `.env.local`, then:

```bash
npm run dev
```

## Setting up the database

1. Create a Supabase project
2. Run `db/schema.sql` in the Supabase SQL editor
3. Create a public storage bucket called `conflict-images`

## Seeding data

```bash
npm run seed
npm run seed:discussions
```

The first command inserts 8 documented conflicts. The second creates 25 users and 70+ discussion messages across all conflicts.

## Data sources

| Source | What it provides | Frequency |
|--------|-----------------|-----------|
| ACLED | Conflict events, fatalities | Weekly |
| ReliefWeb | Humanitarian reports, disaster alerts | Daily |
| UNHCR | Refugee and displacement stats | Monthly |
| Wikipedia | Background context for submissions | On demand |
| Google News | Recent news as sources | On demand |

## Auto sync

Conflict data is refreshed every Monday at 3am via a Vercel cron job. The sync does two things: updates existing conflicts with the latest data, and discovers new crises from ReliefWeb disaster alerts.

To trigger manually:

```bash
curl -X POST https://raiseurvoice.vercel.app/api/sync \
  -H "x-sync-secret: YOUR_SYNC_SECRET"
```

## Tech stack

- Next.js 15 with App Router and TypeScript
- Supabase for PostgreSQL database, realtime subscriptions, and file storage
- Tailwind CSS for styling
- Vercel for hosting and cron jobs

## Contributing

The project is open source. Fork it, branch from `main` with a `feat/`, `fix/`, or `chore/` prefix, and open a PR. Every PR needs a passing build.

If you have ideas or want to report an issue, open one on GitHub.

## License

MIT
