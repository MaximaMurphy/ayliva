-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url text NOT NULL,
  visitor_ip text NOT NULL,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Create admin policy
CREATE POLICY "Admins can manage visits"
ON visits
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'aylivaadmin@gmail.com'::text)
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'aylivaadmin@gmail.com'::text);

-- Create public insert policy
CREATE POLICY "Anyone can record visits"
ON visits
FOR INSERT
TO public
WITH CHECK (true);