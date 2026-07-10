-- ============================================================================
-- Media Storage Migration
-- Creates the public "media" bucket used for admin image/video uploads
-- (gallery, work-case before/after, chairman & leader photos).
-- Run this in Supabase SQL Editor.
-- ============================================================================

-- 1. Create the bucket (public read, 200 MB per file)
--    NOTE: on the Supabase FREE plan the platform hard-caps uploads at 50 MB
--    regardless of this value. Upgrade to Pro (and raise the global upload
--    limit in Dashboard -> Project Settings -> Storage) for files up to 200 MB.
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 209715200)
on conflict (id) do update set public = true, file_size_limit = 209715200;

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
