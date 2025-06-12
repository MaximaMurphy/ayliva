-- Create services table if it doesn't exist
CREATE TABLE IF NOT EXISTS services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage services" ON services;
DROP POLICY IF EXISTS "Public can view active services" ON services;

-- Create admin policy
CREATE POLICY "Admins can manage services"
ON services
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'aylivaadmin@gmail.com'::text)
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'aylivaadmin@gmail.com'::text);

-- Create public read policy
CREATE POLICY "Public can view active services"
ON services
FOR SELECT
TO public
USING (active = true);