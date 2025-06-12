/*
  # Create appointments table

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `service` (text)
      - `appointment_date` (timestamptz)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `appointments` table
    - Add policies for authenticated users to manage appointments
*/

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  service text NOT NULL,
  appointment_date timestamptz NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@elegance.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@elegance.com');