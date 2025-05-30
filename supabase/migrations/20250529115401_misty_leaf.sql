-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active services" ON services;
DROP POLICY IF EXISTS "Admins can manage services" ON services;

-- Create services table with optimized structure
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price text,
  duration text,
  category text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Optimize policies
CREATE POLICY "Anyone can view active services"
  ON services
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Admins can manage services"
  ON services
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@elegance.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@elegance.com');

-- Add initial services with optimized data
INSERT INTO services (name, description, price, duration, category, active) VALUES
  ('Saç Kesimi & Şekillendirme', 'Tüm saç tipleri için uzman kesim ve şekillendirme', '45 ₺''den başlayan', '30-60 dk', 'Saç', true),
  ('Saç Boyama & Balyaj', 'Balyaj, ombre ve profesyonel röfle dahil premium renklendirme', '75 ₺''den başlayan', '90-120 dk', 'Saç', true),
  ('Cilt Bakımı & Maske', 'Cilt tipinize ve ihtiyaçlarınıza özel yenileyici bakımlar', '60 ₺''den başlayan', '45-60 dk', 'Cilt', true),
  ('Manikür & Pedikür', 'Premium, uzun ömürlü ürünlerle tırnak bakımı', '35 ₺''den başlayan', '30-45 dk', 'Tırnak', true),
  ('Makyaj & Stil', 'Özel günler ve profesyonel makyaj hizmetleri', '50 ₺''den başlayan', '45-60 dk', 'Makyaj', true),
  ('Saç Kaynak', 'Yüksek kaliteli saç kaynak uygulamaları', '150 ₺''den başlayan', '120-180 dk', 'Saç', true);