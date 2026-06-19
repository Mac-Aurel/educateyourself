-- ============================================================
-- educateyourself — Supabase schema
-- Run this in the Supabase SQL editor to set up the database.
-- ============================================================


-- -------------------------------------------------------
-- Types
-- -------------------------------------------------------

create type conflict_status as enum ('active', 'monitoring', 'resolved');


-- -------------------------------------------------------
-- Table: conflicts
-- One row per global conflict or human rights crisis.
-- -------------------------------------------------------

create table conflicts (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  country        text not null,
  status         conflict_status not null default 'active',
  summary        text not null default '',
  fatalities     integer,
  displaced      integer,
  sources        jsonb not null default '[]',
  actions        jsonb not null default '[]',
  last_synced_at timestamptz,
  created_at     timestamptz not null default now()
);

create index conflicts_slug_idx on conflicts (slug);
create index conflicts_status_idx on conflicts (status);


-- -------------------------------------------------------
-- Table: discussions
-- Anonymous comments attached to a conflict.
-- parent_id is null for top-level messages, set for replies.
-- -------------------------------------------------------

create table discussions (
  id          uuid primary key default gen_random_uuid(),
  conflict_id uuid not null references conflicts (id) on delete cascade,
  parent_id   uuid references discussions (id) on delete cascade,
  author_name text not null,
  content     text not null,
  created_at  timestamptz not null default now()
);

create index discussions_conflict_id_idx on discussions (conflict_id);
create index discussions_parent_id_idx on discussions (parent_id);


-- -------------------------------------------------------
-- Row Level Security
-- -------------------------------------------------------

alter table conflicts  enable row level security;
alter table discussions enable row level security;

-- Anyone can read conflicts
create policy "conflicts: public read"
  on conflicts for select
  using (true);

-- Only the service role (our sync route) can insert or update conflicts
create policy "conflicts: service role write"
  on conflicts for all
  using (auth.role() = 'service_role');

-- Anyone can read discussions
create policy "discussions: public read"
  on discussions for select
  using (true);

-- Anyone can post a comment (no account required)
create policy "discussions: public insert"
  on discussions for insert
  with check (true);
