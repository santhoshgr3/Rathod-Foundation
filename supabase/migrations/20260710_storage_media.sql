-- ============================================================================
-- Media Storage Migration
-- Creates the public "media" bucket used for admin image/video uploads
-- (gallery, work-case before/after, chairman & leader photos).
-- Run this in Supabase SQL Editor.
-- ============================================================================

-- 1. Create the bucket (public read, 50 MB per file)
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 52428800)
on conflict (id) do update set public = true, file_size_limit = 52428800;

-- 2. Policies: public read, anon upload/update/delete limited to this bucket.
--    (Admin panel uses the anon key; the panel itself is password-gated.)
drop policy if exists "media public read"   on storage.objects;
drop policy if exists "media anon insert"   on storage.objects;
drop policy if exists "media anon update"   on storage.objects;
drop policy if exists "media anon delete"   on storage.objects;

create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

create policy "media anon insert" on storage.objects
  for insert with check (bucket_id = 'media');

create policy "media anon update" on storage.objects
  for update using (bucket_id = 'media');

create policy "media anon delete" on storage.objects
  for delete using (bucket_id = 'media');
