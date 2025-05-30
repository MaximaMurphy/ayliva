-- Enable RLS for contact_info if not already enabled
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view contact info" ON contact_info;
DROP POLICY IF EXISTS "Admins can manage contact info" ON contact_info;

-- Create policies for contact_info
CREATE POLICY "Public can view contact info"
ON contact_info
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage contact info"
ON contact_info
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'aylivaadmin@gmail.com'::text)
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'aylivaadmin@gmail.com'::text);

-- Enable RLS for services if not already enabled
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view active services" ON services;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON services;

-- Create policies for services
CREATE POLICY "Public can view active services"
ON services
FOR SELECT
TO public
USING (active = true);

CREATE POLICY "Allow insert for authenticated"
ON services
FOR INSERT
TO authenticated
WITH CHECK (true);