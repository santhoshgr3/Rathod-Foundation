-- ============================================================================
-- CMS Extensions Migration
-- Run this in Supabase SQL Editor (or via CLI) to enable all new CMS features.
-- ============================================================================

-- 1. Add site_url + social links to cms_site
ALTER TABLE cms_site
  ADD COLUMN IF NOT EXISTS site_url   text DEFAULT 'https://rathodfoundation.in',
  ADD COLUMN IF NOT EXISTS facebook   text DEFAULT '',
  ADD COLUMN IF NOT EXISTS instagram  text DEFAULT '',
  ADD COLUMN IF NOT EXISTS youtube    text DEFAULT '',
  ADD COLUMN IF NOT EXISTS twitter    text DEFAULT '';

-- 2. Help categories table (powers the Seek Help page category grid)
CREATE TABLE IF NOT EXISTS cms_help_categories (
  id          text    PRIMARY KEY,
  icon        text    NOT NULL DEFAULT 'hand',
  en          text    NOT NULL,
  te          text    NOT NULL DEFAULT '',
  hi          text    NOT NULL DEFAULT '',
  desc_en     text    NOT NULL DEFAULT '',
  sort_order  integer NOT NULL DEFAULT 0
);

-- 3. Campaigns table (powers the Volunteer page upcoming campaigns list)
CREATE TABLE IF NOT EXISTS cms_campaigns (
  id          text    PRIMARY KEY,
  title       text    NOT NULL,
  date        text    NOT NULL DEFAULT '',
  area        text    NOT NULL DEFAULT '',
  sort_order  integer NOT NULL DEFAULT 0
);
