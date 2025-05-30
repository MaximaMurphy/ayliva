/*
  # Update services table RLS policies

  1. Changes
    - Add explicit INSERT policy for admins
    - Add explicit UPDATE policy for admins
    - Add explicit DELETE policy for admins
    
  2. Security
    - Policies are restricted to admin users only (email = 'admin@elegance.com')
    - Maintains existing SELECT policy for public users to view active services
*/

-- Drop existing policy that might conflict
DROP POLICY IF EXISTS "Admins can manage all services" ON services;

-- Create specific policies for each operation
CREATE POLICY "Admins can insert services"
ON services
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'admin@elegance.com'::text);

CREATE POLICY "Admins can update services"
ON services
FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'admin@elegance.com'::text)
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'admin@elegance.com'::text);

CREATE POLICY "Admins can delete services"
ON services
FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'admin@elegance.com'::text);

-- Recreate the SELECT policy to ensure it exists
DROP POLICY IF EXISTS "Anyone can view active services" ON services;
CREATE POLICY "Anyone can view active services"
ON services
FOR SELECT
TO public
USING (active = true);