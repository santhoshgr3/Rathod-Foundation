-- ============================================================================
-- Admin auth + privacy hardening
--
-- Problem this fixes:
--  - cms_site.admin_password was readable by anyone holding the public anon
--    key (it ships in the browser bundle) — the admin login screen was a
--    client-side check only, not real protection.
--  - Every CMS/case/volunteer table had "for all using (true)" policies for
--    anon, so writes (and full-table reads of citizen names/phones/details)
--    never actually required being logged into the admin panel.
--
-- Fix: admin now signs in via real Supabase Auth. Writes to CMS/case/
-- volunteer tables require an authenticated session. Public pages that need
-- data (Track, Dashboard) go through SECURITY DEFINER functions that return
-- only the non-sensitive columns they actually use.
--
-- Run this once in Supabase Dashboard → SQL Editor → New query → Run.
-- ============================================================================

-- 1. Remove the plaintext admin password column — no longer used.
alter table public.cms_site drop column if exists admin_password;

-- 2. CMS content tables: public read stays (it's public marketing content),
--    writes require an authenticated admin session.
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'cms_site','cms_home','cms_pages','cms_chairman','cms_bio',
    'cms_gallery','cms_timeline','cms_work_cases',
    'cms_stats','cms_wards','cms_steps','cms_help_categories','cms_campaigns'
  ] loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('drop policy if exists "anon_all_%s" on public.%I', tbl, tbl);
    execute format('drop policy if exists "public_read_%s" on public.%I', tbl, tbl);
    execute format('drop policy if exists "admin_write_%s" on public.%I', tbl, tbl);
    execute format('create policy "public_read_%s" on public.%I for select using (true)', tbl, tbl);
    execute format('create policy "admin_write_%s" on public.%I for all to authenticated using (true) with check (true)', tbl, tbl);
  end loop;
end $$;

-- 3. cases / volunteers / suggestions: the public may still INSERT (submit a
--    report, register as a volunteer, suggest an issue) with no login. Raw
--    SELECT of these tables (names, phone numbers, issue details) is now
--    admin-only. Anonymous lookups go through the functions in step 4.
drop policy if exists "cases_read"   on public.cases;
drop policy if exists "cases_insert" on public.cases;
drop policy if exists "cases_update" on public.cases;
create policy "cases_insert"       on public.cases for insert with check (true);
create policy "cases_admin_read"   on public.cases for select to authenticated using (true);
create policy "cases_admin_update" on public.cases for update to authenticated using (true) with check (true);

drop policy if exists "volunteers_read"   on public.volunteers;
drop policy if exists "volunteers_insert" on public.volunteers;
create policy "volunteers_insert"     on public.volunteers for insert with check (true);
create policy "volunteers_admin_read" on public.volunteers for select to authenticated using (true);

drop policy if exists "suggestions_read"   on public.suggestions;
drop policy if exists "suggestions_insert" on public.suggestions;
create policy "suggestions_insert"     on public.suggestions for insert with check (true);
create policy "suggestions_admin_read" on public.suggestions for select to authenticated using (true);

-- 4. Public-safe RPCs — the only way anonymous visitors touch case data now.
--    Each returns just the columns the public site actually displays.

-- Track a single case by tracking ID (used by /track and the report form's
-- lookup). Never exposes name, phone, or free-text details.
create or replace function public.track_case(p_id text)
returns table (
  id text, type text, category text, location text,
  stage_index int, outcome text, timeline jsonb, created_at timestamptz
)
language sql security definer set search_path = public as $$
  select c.id, c.type, c.category, c.location, c.stage_index, c.outcome, c.timeline, c.created_at
  from public.cases c
  where upper(c.id) = upper(p_id)
  limit 1;
$$;
grant execute on function public.track_case(text) to anon, authenticated;

-- Aggregate counts for the public dashboard — no raw rows leave the DB.
create or replace function public.public_stats()
returns table (
  received int, verified int, resolved int, volunteers int, wards int,
  by_category jsonb
)
language sql security definer set search_path = public as $$
  select
    (select count(*) from public.cases)::int,
    (select count(*) from public.cases where stage_index >= 2)::int,
    (select count(*) from public.cases where stage_index >= 4)::int,
    (48 + (select count(*) from public.volunteers))::int,
    greatest(7, (select count(distinct location) from public.cases where location <> ''))::int,
    (select coalesce(jsonb_agg(jsonb_build_object('category', category, 'count', cnt) order by cnt desc), '[]'::jsonb)
     from (select category, count(*) cnt from public.cases group by category) s);
$$;
grant execute on function public.public_stats() to anon, authenticated;

-- Recent activity feed for the public dashboard — no name/phone/details.
create or replace function public.recent_activity(p_limit int default 6)
returns table (
  id text, type text, category text, location text, stage_index int, created_at timestamptz
)
language sql security definer set search_path = public as $$
  select c.id, c.type, c.category, c.location, c.stage_index, c.created_at
  from public.cases c
  order by c.created_at desc
  limit p_limit;
$$;
grant execute on function public.recent_activity(int) to anon, authenticated;
