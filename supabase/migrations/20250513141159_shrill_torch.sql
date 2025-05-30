/*
  # Add SEO fields to blog_posts table

  1. Changes
    - Add meta_description column for SEO descriptions
    - Add meta_keywords column for SEO keywords
    - Add slug column for URL-friendly post titles

  2. Notes
    - All new columns are nullable to maintain compatibility with existing posts
    - Slug column will be used for SEO-friendly URLs
*/

ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS meta_keywords text,
ADD COLUMN IF NOT EXISTS slug text;