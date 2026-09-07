-- ============================================================================
-- Report-issue categories — make the "Report an issue" form dropdown editable
-- from the Admin panel (Data → Report Categories).
--
-- Until now the civic issue types ("Roads & potholes", "Water supply", …) were
-- hard-coded in the frontend bundle. This table lets an admin add / rename /
-- remove them like any other CMS list.
--
-- Run this once in Supabase Dashboard → SQL Editor → New query → Run.
-- ============================================================================

create table if not exists public.cms_report_categories (
  label       text    not null,
  sort_order  integer not null default 0,
  primary key (label)
);

alter table public.cms_report_categories enable row level security;

drop policy if exists "public_read_cms_report_categories"  on public.cms_report_categories;
drop policy if exists "admin_write_cms_report_categories"  on public.cms_report_categories;

-- Public marketing content: anyone may read.
create policy "public_read_cms_report_categories"
  on public.cms_report_categories for select using (true);

-- Only a signed-in admin (Supabase Auth session) may change it.
create policy "admin_write_cms_report_categories"
  on public.cms_report_categories for all to authenticated using (true) with check (true);

-- Seed with the categories the site shipped with (safe to re-run).
insert into public.cms_report_categories (label, sort_order) values
  ('Roads & potholes',        0),
  ('Water supply',            1),
  ('Drainage & sewage',       2),
  ('Street lighting',         3),
  ('Garbage & sanitation',    4),
  ('Parks & public spaces',   5),
  ('Electricity',             6),
  ('Other',                   7)
on conflict (label) do nothing;
