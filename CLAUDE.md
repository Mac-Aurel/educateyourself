# CLAUDE.md — educateyourself

Guide for anyone (human or AI) working on this codebase.

---

## Commit rules — non-negotiable

- **No "Claude", "AI", or "Co-Authored-By: Claude"** in any commit message, PR title, or PR body.
- Commits are written as if authored by the human developer.
- Keep commit messages short and in the imperative: `add conflict card component`, `fix ACLED fetch timeout`.

---

## Project overview

**educateyourself** is a social justice awareness platform where users can:
- Browse cards about active global conflicts and human rights crises
- Read up-to-date data pulled from trusted APIs (ACLED, ReliefWeb, UNHCR)
- Discuss each conflict via threaded comment bubbles directly on the card
- Find concrete ways to act (petitions, donations, awareness campaigns)

**Stack:**
- **Frontend + API routes:** Next.js (App Router)
- **Database + Realtime:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Styling:** Tailwind CSS

---

## Code philosophy

> Small functions. One job each. Self-explanatory names. No surprises.

- Every function does **one thing** and is named for that thing.
- No function longer than ~30 lines. Split if it grows.
- No clever one-liners that sacrifice readability.
- No abbreviations in variable names (`conflictId` not `cId`).
- Types everywhere — no `any` in TypeScript.
- Comments only when the **why** is non-obvious (not the what).

---

## Project structure

```
educateyourself/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home — list of conflict cards
│   ├── conflicts/
│   │   └── [slug]/page.tsx     # Individual conflict detail + discussion
│   └── api/
│       ├── conflicts/route.ts  # CRUD for conflicts
│       ├── discussions/route.ts# CRUD for discussion messages
│       └── sync/route.ts       # Trigger data sync from external APIs
│
├── components/
│   ├── cards/
│   │   ├── ConflictCard.tsx    # Single conflict card (summary view)
│   │   └── ConflictGrid.tsx    # Grid layout of all cards
│   ├── discussion/
│   │   ├── DiscussionBubble.tsx# Single comment bubble
│   │   ├── DiscussionThread.tsx# Full thread for a conflict
│   │   └── CommentForm.tsx     # Submit new comment
│   └── ui/                     # Reusable UI primitives (Button, Badge, etc.)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server-side Supabase client
│   ├── api/
│   │   ├── acled.ts            # Fetch and normalize ACLED data
│   │   ├── reliefweb.ts        # Fetch and normalize ReliefWeb reports
│   │   └── unhcr.ts            # Fetch and normalize UNHCR statistics
│   └── utils/
│       ├── formatDate.ts       # Date formatting helpers
│       ├── normalizeConflict.ts# Map raw API data → internal Conflict type
│       └── slugify.ts          # Generate URL slugs from conflict names
│
├── types/
│   ├── conflict.ts             # Conflict, ConflictSummary types
│   ├── discussion.ts           # Message, Thread types
│   └── api.ts                  # Raw API response types (ACLED, ReliefWeb, UNHCR)
│
├── db/
│   └── schema.sql              # Supabase table definitions (source of truth)
│
└── scripts/
    └── seed.ts                 # Seed initial conflict data manually
```

---

## Data sources

| Source | What it provides | Update frequency | Docs |
|--------|-----------------|-----------------|------|
| ACLED | Armed conflict events, fatalities, locations | Weekly | acleddata.com/api |
| ReliefWeb | Humanitarian reports, crisis summaries | Daily | reliefweb.int/api |
| UNHCR | Refugee & displacement statistics | Monthly | data.unhcr.org/api |

API keys go in `.env.local` — never committed.

---

## Database schema (Supabase)

### `conflicts`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| slug | text | URL identifier |
| title | text | Conflict name |
| country | text | Country/region |
| status | enum | `active`, `monitoring`, `resolved` |
| summary | text | Short description (from ReliefWeb) |
| fatalities | integer | Latest fatality count (from ACLED) |
| displaced | integer | Displaced persons count (from UNHCR) |
| sources | jsonb | Array of source URLs |
| actions | jsonb | Array of {label, url} for "how to act" |
| last_synced_at | timestamp | Last API sync |
| created_at | timestamp | |

### `discussions`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| conflict_id | uuid | FK → conflicts.id |
| parent_id | uuid | FK → discussions.id (for replies) |
| author_name | text | Display name (anonymous allowed) |
| content | text | Comment text |
| created_at | timestamp | |

---

## Environment variables

```bash
# .env.local (never commit this file)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ACLED_API_KEY=
ACLED_EMAIL=
RELIEFWEB_APP_NAME=
UNHCR_API_KEY=
```

---

## Adding a new conflict (manual)

1. Add a row to `conflicts` in Supabase (or via `scripts/seed.ts`)
2. Fill `actions` array with petition/donation links
3. The card appears automatically on the home page

## Adding a new API source

1. Create `lib/api/<sourcename>.ts`
2. Export one fetch function and one normalize function
3. Call the normalize function in `lib/utils/normalizeConflict.ts`
4. Add a cron trigger in `app/api/sync/route.ts`

---

## Contributing

- Branch from `main`, name your branch `feat/`, `fix/`, or `chore/`
- One PR per feature/fix
- No PR merges without a passing build
- Keep functions small — if you're writing a comment to explain what a block does, extract it into a named function instead
