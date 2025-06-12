-- Create works table
CREATE TABLE IF NOT EXISTS works (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- Create admin policy
CREATE POLICY "Admins can manage works"
ON works
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'aylivaadmin@gmail.com'::text)
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'aylivaadmin@gmail.com'::text);

-- Create public read policy
CREATE POLICY "Public can view active works"
ON works
FOR SELECT
TO public
USING (active = true);