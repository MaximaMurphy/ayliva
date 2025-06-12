/*
  # Update Gallery RLS Policies

  1. Changes
    - Drop existing policies and recreate them with proper permissions
    - Ensure admin can perform all operations
    - Keep public view access for published items

  2. Security
    - Enable RLS on gallery table (if not already enabled)
    - Add comprehensive policies for admin operations
    - Maintain public read access for published items
*/

-- First enable RLS if not already enabled
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Admins can manage gallery" ON gallery;
DROP POLICY IF EXISTS "Anyone can view published gallery items" ON gallery;

-- Create comprehensive admin policy for all operations
CREATE POLICY "Admins can manage gallery"
ON gallery
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@elegance.com')
WITH CHECK (auth.jwt() ->> 'email' = 'admin@elegance.com');

-- Recreate public read policy for published items
CREATE POLICY "Anyone can view published gallery items"
ON gallery
FOR SELECT
TO public
USING (published = true);