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
USING (
  (auth.jwt() ->> 'email'::text) IN ('admin@elegance.com'::text, 'aylivaadmin@gmail.com'::text)
)
WITH CHECK (
  (auth.jwt() ->> 'email'::text) IN ('admin@elegance.com'::text, 'aylivaadmin@gmail.com'::text)
);

-- Recreate public read policy for published items
CREATE POLICY "Anyone can view published gallery items"
ON gallery
FOR SELECT
TO public
USING (published = true);