-- ============================================================================
--  Rathod Foundation — CMS tables v2
--  Replaces the single cms_content JSON-blob with 11 typed tables.
--
--  Run this in Supabase Dashboard → SQL Editor → New query → Run.
--
--  WARNING: If you ran the old schema and have customised content in
--  cms_content, copy it down first — this script drops that table and
--  resets to defaults on next admin load.
-- ============================================================================

-- Drop the old single-blob table (safe to skip if it never existed)
drop table if exists public.cms_content cascade;

-- ── 1. cms_site  (leader info + admin password, always exactly 1 row) ────────
create table if not exists public.cms_site (
  id             int         primary key default 1,
  name           text        not null default '',
  short_name     text        not null default '',
  org            text        not null default '',
  role           text        not null default '',
  tagline        text        not null default '',
  dob            text        not null default '',
  community      text        not null default '',
  location       text        not null default '',
  email          text        not null default '',
  whatsapp       text        not null default '',
  phones         jsonb       not null default '[]',
  languages      jsonb       not null default '[]',
  photos         jsonb       not null default '{}',
  admin_password text        not null default 'RF@2024',
  updated_at     timestamptz not null default now(),
  constraint cms_site_single check (id = 1)
);

-- ── 2. cms_home  (hero section + vision text + promises ticker) ───────────────
create table if not exists public.cms_home (
  id            int         primary key default 1,
  badge         text        not null default '',
  hero_title    text        not null default '',
  hero_subtitle text        not null default '',
  hero_body     text        not null default '',
  vision_text   text        not null default '',
  promises      jsonb       not null default '[]',
  updated_at    timestamptz not null default now(),
  constraint cms_home_single check (id = 1)
);

-- ── 3. cms_pages  (page header: eyebrow / title / subtitle — one row per page)
create table if not exists public.cms_pages (
  page_key   text        primary key,  -- 'work' | 'impact' | 'process' | ...
  eyebrow    text        not null default '',
  title      text        not null default '',
  subtitle   text        not null default '',
  updated_at timestamptz not null default now()
);

-- ── 4. cms_chairman  (chairman card on About page, always exactly 1 row) ──────
create table if not exists public.cms_chairman (
  id          int         primary key default 1,
  name        text        not null default '',
  role        text        not null default '',
  affiliation text        not null default '',
  bio         text        not null default '',
  highlights  jsonb       not null default '[]',
  photo       text        not null default '',
  updated_at  timestamptz not null default now(),
  constraint cms_chairman_single check (id = 1)
);

-- ── 5. cms_bio  (biography intro, journey timeline, values cards) ─────────────
create table if not exists public.cms_bio (
  id         int         primary key default 1,
  intro      text        not null default '',
  journey    jsonb       not null default '[]',
  values     jsonb       not null default '[]',
  updated_at timestamptz not null default now(),
  constraint cms_bio_single check (id = 1)
);

-- ── 6. cms_gallery  (gallery photos, ordered by sort_order) ──────────────────
create table if not exists public.cms_gallery (
  id         text        primary key,
  src        text        not null default '',
  caption    text        not null default '',
  tag        text        not null default 'events'
               check (tag in ('leader','events','work')),
  sort_order int         not null default 0,
  created_at timestamptz not null default now()
);

-- ── 7. cms_timeline  (milestone cards on Gallery page) ───────────────────────
create table if not exists public.cms_timeline (
  id         text primary key,
  year       text not null default '',
  title      text not null default '',
  detail     text not null default '',
  color      text not null default 'saffron'
               check (color in ('saffron','green')),
  icon       text not null default '📌',
  sort_order int  not null default 0
);

-- ── 8. cms_work_cases  (before/after work showcase) ──────────────────────────
create table if not exists public.cms_work_cases (
  id           text        primary key,
  title        text        not null default '',
  date         text        not null default '',
  location     text        not null default '',
  category     text        not null default '',
  days         int         not null default 7,
  before_media text        not null default '',
  after_media  text        not null default '',
  summary      text        not null default '',
  sort_order   int         not null default 0,
  created_at   timestamptz not null default now()
);

-- ── 9. cms_stats  (hero stat cards) ──────────────────────────────────────────
create table if not exists public.cms_stats (
  id         serial primary key,
  value      int  not null default 0,
  suffix     text not null default '',
  label      text not null default '',
  sort_order int  not null default 0
);

-- ── 10. cms_wards  (ward / locality impact bars) ─────────────────────────────
create table if not exists public.cms_wards (
  id         serial primary key,
  name       text not null default '',
  count      int  not null default 0,
  sort_order int  not null default 0
);

-- ── 11. cms_steps  (How It Works process steps) ──────────────────────────────
create table if not exists public.cms_steps (
  id         serial primary key,
  n          text not null default '',
  title      text not null default '',
  text       text not null default '',
  sort_order int  not null default 0
);

-- ── Row Level Security: open read + write for anon key ───────────────────────
-- All CMS writes go through the admin panel (password-gated in the UI).
-- For stronger security later: add Supabase Auth + user-role checks here.
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'cms_site','cms_home','cms_pages','cms_chairman','cms_bio',
    'cms_gallery','cms_timeline','cms_work_cases',
    'cms_stats','cms_wards','cms_steps'
  ] loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('drop policy if exists "anon_all_%s" on public.%I', tbl, tbl);
    execute format(
      'create policy "anon_all_%s" on public.%I for all using (true) with check (true)',
      tbl, tbl
    );
  end loop;
end $$;
