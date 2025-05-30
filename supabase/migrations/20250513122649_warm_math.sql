/*
  # Create gallery table

  1. New Tables
    - `gallery`
      - `id` (uuid, primary key)
      - `title` (text)
      - `image_url` (text)
      - `description` (text)
      - `category` (text)
      - `published` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `gallery` table
    - Add policies for public read access and admin write access
*/

CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  description text,
  category text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published gallery items"
  ON gallery
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Admins can manage gallery"
  ON gallery
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@elegance.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@elegance.com');