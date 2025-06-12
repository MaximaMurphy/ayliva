-- Add media_type column to gallery table
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image';
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS video_url text;