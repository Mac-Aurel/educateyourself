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
  country_code   text not null,  -- ISO3 code used for UNHCR lookups (e.g. SDN, PSE)
  region         text not null default '',
  status         conflict_status not null default 'active',
  started_at     text not null default '',
  summary        text not null default '',
  key_facts      jsonb not null default '[]',
  fatalities     integer,
  displaced      integer,
  refugees       integer,
  children_affected integer,
  image_url      text,
  sources        jsonb not null default '[]',
  actions        jsonb not null default '[]',
  submitted_by   text,
  last_synced_at timestamptz,
  created_at     timestamptz not null default now()
);

create index conflicts_slug_idx on conflicts (slug);
create index conflicts_status_idx on conflicts (status);


-- -------------------------------------------------------
-- Table: app_users
-- Username-only accounts. No email, no OAuth.
-- -------------------------------------------------------

create table app_users (
  id            uuid primary key default gen_random_uuid(),
  username      text not null unique,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

create index app_users_username_idx on app_users (username);


-- -------------------------------------------------------
-- Table: discussions
-- Comments attached to a conflict.
-- Anonymous if user_id is null, linked to account otherwise.
-- -------------------------------------------------------

create table discussions (
  id          uuid primary key default gen_random_uuid(),
  conflict_id uuid not null references conflicts (id) on delete cascade,
  parent_id   uuid references discussions (id) on delete cascade,
  user_id     uuid references app_users (id) on delete set null,
  author_name text not null,
  content     text not null,
  created_at  timestamptz not null default now()
);

create index discussions_conflict_id_idx on discussions (conflict_id);
create index discussions_parent_id_idx on discussions (parent_id);


-- -------------------------------------------------------
-- Table: discussion_likes
-- One like per user per message.
-- -------------------------------------------------------

create table discussion_likes (
  id            uuid primary key default gen_random_uuid(),
  discussion_id uuid not null references discussions (id) on delete cascade,
  user_id       uuid not null references app_users (id) on delete cascade,
  created_at    timestamptz not null default now(),
  unique (discussion_id, user_id)
);

create index discussion_likes_discussion_id_idx on discussion_likes (discussion_id);


-- -------------------------------------------------------
-- Row Level Security
-- -------------------------------------------------------

alter table conflicts   enable row level security;
alter table discussions  enable row level security;
alter table app_users    enable row level security;

-- Anyone can read conflicts
create policy "conflicts: public read"
  on conflicts for select
  using (true);

-- Anyone can submit a new conflict
create policy "conflicts: public insert"
  on conflicts for insert
  with check (true);

-- Only the service role (our sync route) can update or delete conflicts
create policy "conflicts: service role write"
  on conflicts for update
  using (auth.role() = 'service_role');

create policy "conflicts: service role delete"
  on conflicts for delete
  using (auth.role() = 'service_role');

-- Anyone can read discussions
create policy "discussions: public read"
  on discussions for select
  using (true);

-- Anyone can post a comment (no account required)
create policy "discussions: public insert"
  on discussions for insert
  with check (true);

-- Likes: anyone can read, authenticated users can toggle
alter table discussion_likes enable row level security;

create policy "likes: public read"
  on discussion_likes for select
  using (true);

create policy "likes: public insert"
  on discussion_likes for insert
  with check (true);

create policy "likes: public delete"
  on discussion_likes for delete
  using (true);

-- app_users: only the service role manages accounts (our API routes handle this)
create policy "app_users: service role only"
  on app_users for all
  using (auth.role() = 'service_role');
