-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can update services" ON services;
DROP POLICY IF EXISTS "Admins can create services" ON services;
DROP POLICY IF EXISTS "Admins can delete services" ON services;
DROP POLICY IF EXISTS "Admins can view all services" ON services;
DROP POLICY IF EXISTS "Public can view active services" ON services;
DROP POLICY IF EXISTS "Anyone can view active services" ON services;
DROP POLICY IF EXISTS "Admins can manage services" ON services;
DROP POLICY IF EXISTS "Admins can manage all services" ON services;
DROP POLICY IF EXISTS "Admins can insert services" ON services;

-- Enable RLS if not already enabled
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create comprehensive admin policy for all operations
CREATE POLICY "Admins can manage services"
ON services
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'admin@elegance.com'::text)
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'admin@elegance.com'::text);

-- Create SELECT policy for public users (to see only active services)
CREATE POLICY "Public can view active services"
ON services
FOR SELECT
TO public
USING (active = true);