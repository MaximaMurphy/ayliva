/*
  # Create blog posts table

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `excerpt` (text)
      - `image_url` (text)
      - `author` (text)
      - `category` (text)
      - `published` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policies for public read access and admin write access
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  image_url text,
  author text NOT NULL,
  category text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Admins can manage all blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@elegance.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@elegance.com');