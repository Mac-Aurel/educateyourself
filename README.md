# Raise ur voice

Most conflicts and humanitarian crises around the world get a few days of media coverage and then disappear from public attention. Sudan, Congo, Yemen, Myanmar, these have been going on for years and most people have no idea.

Raise ur voice is a platform that tries to fix that. It brings together verified information about active crises in one place, lets people discuss what's happening, and gives them concrete ways to help. Anyone can submit a crisis that isn't covered yet, and the site updates itself when new ones emerge.

The project is open source and free to use.

**Live site:** raiseurvoice.vercel.app

## How it works

When you land on the site, you see a grid of active crises around the world. Each card shows the country, the number of people killed and displaced, and a short summary. Click on one and you get the full picture: a detailed overview, key facts, verified sources, links to donate or take action, and a discussion space where people can share their perspective.

If you know about a crisis that's missing, you can submit it. The system searches Wikipedia, ReliefWeb, UNHCR, and Google News to pull together a summary, key facts, sources, and action links for you. You review everything, edit what you want, and publish. It goes live immediately.

Every Monday, the site automatically checks for new crises through ReliefWeb's disaster alert system. If a new conflict or humanitarian emergency appears that isn't already covered, it gets added to the site with the available information.

## Features

- Documented crises with summaries, key facts, statistics (fatalities, displaced, refugees, children affected), images, sources, and action links
- Community submissions with auto-fill from four free data sources
- Automatic weekly discovery of new crises
- Threaded discussions under each crisis
- Like system for comments
- Image upload from your device or by URL
- Smart search bar that suggests existing crises or lets you submit a new one
- Page translation via Google Translate
- Minimalist responsive design that works on phones, tablets, and desktop
- Username and password accounts, no email required

## Running it locally

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

Open `http://localhost:3000` and you should see the site.

## Database setup

1. Create a project on supabase.com
2. Copy the contents of `db/schema.sql` and run it in the Supabase SQL editor
3. Go to Storage and create a public bucket called `conflict-images`
4. Add your Supabase URL and keys to `.env.local`

## Seeding data

```bash
npm run seed
npm run seed:discussions
```

The first command adds 8 documented conflicts with full details. The second creates 25 user accounts and over 70 discussion messages spread across all conflicts in both French and English.

## Data sources

The site pulls information from several free sources.

ACLED provides conflict event data and fatality counts, updated weekly. ReliefWeb provides humanitarian reports and disaster alerts from UN agencies and NGOs. UNHCR provides refugee and displacement statistics. Wikipedia provides background context when users submit new conflicts. Google News provides recent articles as additional sources.

None of these require payment. ACLED requires a free API key from acleddata.com. The others work without authentication.

## Auto sync

Every Monday at 3am, a Vercel cron job runs the sync. It does two things. First, it updates existing crises with the latest data from ACLED, ReliefWeb, and UNHCR. Second, it checks ReliefWeb's disaster alerts for new emergencies and adds any that aren't already on the site.

You can trigger the sync manually:

```bash
curl -X POST https://raiseurvoice.vercel.app/api/sync \
  -H "x-sync-secret: YOUR_SYNC_SECRET"
```

## Tech stack

The frontend and API routes are built with Next.js 15 using the App Router and TypeScript. The database is PostgreSQL hosted on Supabase, which also handles realtime subscriptions for live discussion updates and file storage for uploaded images. The UI is styled with Tailwind CSS. The site is hosted on Vercel with automatic deployments on every push to main.

## Contributing

The project is open source and contributions are welcome. Fork the repo, create a branch from `main` with a `feat/`, `fix/`, or `chore/` prefix, and open a pull request. Every PR needs a passing build.

If you have ideas, feedback, or want to report a bug, open an issue on GitHub.

## License

MIT
