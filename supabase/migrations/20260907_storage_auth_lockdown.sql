-- ============================================================================
-- Storage lockdown — media uploads now require a signed-in admin
--
-- The original media-bucket policies (20260710_storage_media.sql) allowed the
-- `anon` role to INSERT / UPDATE / DELETE objects, because the admin panel
-- used to run entirely on the public anon key. Since 20260818 the admin panel
-- signs in with real Supabase Auth, so writes should require an authenticated
-- session — otherwise anyone holding the public anon key (it ships in the
-- browser bundle) can upload or delete media.
--
-- Public READ stays open (the site shows these images to everyone).
--
-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- ============================================================================

drop policy if exists "media public read" on storage.objects;
drop policy if exists "media anon insert" on storage.objects;
drop policy if exists "media anon update" on storage.objects;
drop policy if exists "media anon delete" on storage.objects;
drop policy if exists "media admin insert" on storage.objects;
drop policy if exists "media admin update" on storage.objects;
drop policy if exists "media admin delete" on storage.objects;

-- Anyone may read the public media bucket.
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

-- Only a signed-in admin may add, replace, or remove media.
create policy "media admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media') with check (bucket_id = 'media');

create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
