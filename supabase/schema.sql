-- ============================================================================
--  Rathod Foundation — Supabase schema
--  Run this once in your Supabase dashboard:  SQL Editor → New query → paste →
--  Run.  It creates the three submission tables, row-level-security policies,
--  indexes, and a small set of seed rows so the dashboard looks alive.
-- ============================================================================

-- ---- tables ----------------------------------------------------------------
create table if not exists public.cases (
  id           text primary key,
  type         text not null check (type in ('help','civic')),
  category     text not null,
  name         text not null default '',
  phone        text not null default '',
  location     text not null default '',
  details      text not null default '',
  lang         text not null default 'en',
  stage_index  int  not null default 0,
  outcome      text,                              -- 'resolved' | 'guided' | null
  timeline     jsonb not null default '[]'::jsonb,
  created_at   timestamptz not null default now()
);

create table if not exists public.volunteers (
  id          text primary key,
  name        text not null,
  phone       text not null,
  area        text not null default '',
  skills      text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.suggestions (
  id          text primary key,
  kind        text not null check (kind in ('issue','campaign')),
  text        text not null,
  area        text not null default '',
  created_at  timestamptz not null default now()
);

-- ---- indexes ---------------------------------------------------------------
create index if not exists cases_created_idx       on public.cases (created_at desc);
create index if not exists volunteers_created_idx  on public.volunteers (created_at desc);
create index if not exists suggestions_created_idx on public.suggestions (created_at desc);

-- ---- row level security ----------------------------------------------------
-- This is a public community help desk: the anon key may submit and read.
-- ⚠️ Submitter name/phone are therefore readable by anyone holding the anon key.
-- For production, add Supabase Auth + tighter policies, or move admin writes
-- behind an edge function using the service-role key. See README.
alter table public.cases       enable row level security;
alter table public.volunteers  enable row level security;
alter table public.suggestions enable row level security;

-- cases: read + submit + update stage (admin stage changes use the anon key)
drop policy if exists "cases_read"   on public.cases;
drop policy if exists "cases_insert" on public.cases;
drop policy if exists "cases_update" on public.cases;
create policy "cases_read"   on public.cases for select using (true);
create policy "cases_insert" on public.cases for insert with check (true);
create policy "cases_update" on public.cases for update using (true) with check (true);

-- volunteers: read + submit
drop policy if exists "volunteers_read"   on public.volunteers;
drop policy if exists "volunteers_insert" on public.volunteers;
create policy "volunteers_read"   on public.volunteers for select using (true);
create policy "volunteers_insert" on public.volunteers for insert with check (true);

-- suggestions: read + submit
drop policy if exists "suggestions_read"   on public.suggestions;
drop policy if exists "suggestions_insert" on public.suggestions;
create policy "suggestions_read"   on public.suggestions for select using (true);
create policy "suggestions_insert" on public.suggestions for insert with check (true);

-- ---- seed data (so the dashboard & map feel alive on first visit) ----------
-- Safe to re-run: on conflict do nothing. Delete these rows any time.
insert into public.cases (id, type, category, name, location, stage_index, outcome, timeline, created_at) values
  ('RF-SEED-0001','help','medical','Lakshmi B.','Road No. 12',4,'resolved','[{"stage":"received","at":"now"}]', now() - interval '18 days'),
  ('RF-SEED-0002','help','pension','Ramulu N.','N.B. Nagar',4,'guided','[]', now() - interval '12 days'),
  ('RF-SEED-0003','help','ration','Saroja K.','Journalist Colony',3,null,'[]', now() - interval '9 days'),
  ('RF-SEED-0004','help','education','Imran S.','Road No. 10',4,'resolved','[]', now() - interval '25 days'),
  ('RF-SEED-0005','help','senior','Anasuya R.','MLA Colony',2,null,'[]', now() - interval '3 days'),
  ('RF-SEED-0006','help','scheme','Venkatesh P.','Shri Nagar Colony',4,'guided','[]', now() - interval '30 days'),
  ('RF-SEED-0007','civic','Water supply','Resident','Road No. 14',4,'resolved','[]', now() - interval '14 days'),
  ('RF-SEED-0008','civic','Street lighting','Resident','N.B. Nagar',3,null,'[]', now() - interval '6 days'),
  ('RF-SEED-0009','help','electricity','Sunitha M.','Road No. 12',1,null,'[]', now() - interval '1 days'),
  ('RF-SEED-0010','help','family','Kumar D.','Road No. 10',4,'resolved','[]', now() - interval '21 days'),
  ('RF-SEED-0011','help','medical','Fatima A.','MLA Colony',4,'resolved','[]', now() - interval '40 days'),
  ('RF-SEED-0012','civic','Drainage & sewage','Resident','Journalist Colony',4,'resolved','[]', now() - interval '33 days')
on conflict (id) do nothing;
