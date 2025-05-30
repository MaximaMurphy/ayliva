-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  working_hours jsonb NOT NULL,
  social_media jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Create admin policy
CREATE POLICY "Admins can manage contact info"
ON contact_info
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'aylivaadmin@gmail.com'::text)
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'aylivaadmin@gmail.com'::text);

-- Create public read policy
CREATE POLICY "Public can view contact info"
ON contact_info
FOR SELECT
TO public
USING (true);

-- Insert default contact info if not exists
INSERT INTO contact_info (
  address, 
  phone, 
  email, 
  working_hours,
  social_media
)
SELECT
  'Güzellik Caddesi No: 123, Moda, İstanbul',
  '0212 345 67 89',
  'info@aylivasalon.com',
  '{
    "monday_friday": "09:00 - 20:00",
    "saturday": "09:00 - 18:00",
    "sunday": "10:00 - 16:00"
  }'::jsonb,
  '{
    "facebook": "https://facebook.com/aylivasalon",
    "instagram": "https://instagram.com/aylivasalon",
    "twitter": "https://twitter.com/aylivasalon"
  }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM contact_info);