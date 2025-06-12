-- Enable RLS if not already enabled
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view active services" ON services;
DROP POLICY IF EXISTS "Admins can create services" ON services;
DROP POLICY IF EXISTS "Admins can update services" ON services;
DROP POLICY IF EXISTS "Admins can delete services" ON services;
DROP POLICY IF EXISTS "Admins can view all services" ON services;

-- Create INSERT policy for admin users
CREATE POLICY "Admins can create services"
ON services
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'admin@elegance.com'::text);

-- Create UPDATE policy for admin users
CREATE POLICY "Admins can update services"
ON services
FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'admin@elegance.com'::text)
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'admin@elegance.com'::text);

-- Create DELETE policy for admin users
CREATE POLICY "Admins can delete services"
ON services
FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'admin@elegance.com'::text);

-- Create SELECT policy for admin users (to see all services including inactive ones)
CREATE POLICY "Admins can view all services"
ON services
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'admin@elegance.com'::text);

-- Create SELECT policy for public users (to see only active services)
CREATE POLICY "Public can view active services"
ON services
FOR SELECT
TO public
USING (active = true);