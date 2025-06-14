import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);
  if (error.message) {
    return error.message;
  }
  return 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
};