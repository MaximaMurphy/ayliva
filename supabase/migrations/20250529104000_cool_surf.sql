-- Update the appointments table policies
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can submit appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;

-- Create new policies
CREATE POLICY "Admins can manage all appointments" ON public.appointments
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'aylivaadmin@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'aylivaadmin@gmail.com');

CREATE POLICY "Anyone can submit appointments" ON public.appointments
FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Users can view their own appointments" ON public.appointments
FOR SELECT TO authenticated
USING (
  auth.jwt() ->> 'email' = email
  OR
  auth.jwt() ->> 'email' = 'aylivaadmin@gmail.com'
);