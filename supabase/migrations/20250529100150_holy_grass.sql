/*
  # Fix appointments table RLS policies

  1. Changes
    - Add policy to allow public users to submit appointments
    
  2. Security
    - Maintains existing admin policy for full control
    - Adds new policy for public appointment submissions
    - Keeps RLS enabled
*/

-- Add policy to allow public users to submit appointments
CREATE POLICY "Anyone can submit appointments"
ON public.appointments
FOR INSERT
TO public
WITH CHECK (true);