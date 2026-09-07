-- ============================================================================
-- One-off cleanup: remove duplicate rows that accumulated in the array-backed
-- CMS tables.
--
-- Cause: the admin save path is "delete all rows, then re-insert the list".
-- The delete filter used to be `sort_order >= 0`, which does NOT match rows
-- whose sort_order was NULL (older seeds). Those rows survived every save while
-- a fresh copy was inserted alongside them — so cms_wards / cms_steps /
-- cms_stats ended up with each entry twice, and the site rendered doubled
-- Impact bars, process steps and hero stats.
--
-- The app now (a) de-duplicates on read and (b) deletes with
-- `sort_order >= 0 OR sort_order IS NULL`, so this won't recur. This script
-- compacts the existing rows so the DB itself is clean.
--
-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- ============================================================================

-- cms_wards: keep one row per locality name (the lowest ctid).
delete from public.cms_wards a
using public.cms_wards b
where a.ctid > b.ctid and a.name = b.name;

-- cms_steps: keep one row per step number.
delete from public.cms_steps a
using public.cms_steps b
where a.ctid > b.ctid and a.n = b.n;

-- cms_stats: keep one row per label.
delete from public.cms_stats a
using public.cms_stats b
where a.ctid > b.ctid and a.label = b.label;

-- Normalise sort_order to a clean 0..n-1 sequence for each table.
with ordered as (
  select ctid, row_number() over (order by coalesce(sort_order, 2147483647), ctid) - 1 as rn
  from public.cms_wards
)
update public.cms_wards w set sort_order = o.rn from ordered o where w.ctid = o.ctid;

with ordered as (
  select ctid, row_number() over (order by coalesce(sort_order, 2147483647), ctid) - 1 as rn
  from public.cms_steps
)
update public.cms_steps s set sort_order = o.rn from ordered o where s.ctid = o.ctid;

with ordered as (
  select ctid, row_number() over (order by coalesce(sort_order, 2147483647), ctid) - 1 as rn
  from public.cms_stats
)
update public.cms_stats s set sort_order = o.rn from ordered o where s.ctid = o.ctid;
