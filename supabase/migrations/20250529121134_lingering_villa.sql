/*
  # Fix Services Table RLS Policies

  1. Changes
    - Add RLS policies for INSERT and UPDATE operations for admin users
    - Keep existing SELECT policy for public access to active services
    - Add DELETE policy for admin users

  2. Security
    - Only admin users (admin@elegance.com) can manage services
    - Public users can only view active services
    - All write operations (INSERT, UPDATE, DELETE) restricted to admin
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage services" ON services;
DROP POLICY IF EXISTS "Anyone can view active services" ON services;

-- Recreate the policies with proper permissions
CREATE POLICY "Admins can manage all services"
ON services
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@elegance.com')
WITH CHECK (auth.jwt() ->> 'email' = 'admin@elegance.com');

CREATE POLICY "Anyone can view active services"
ON services
FOR SELECT
TO public
USING (active = true);