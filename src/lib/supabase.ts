import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase environment variables. 
    VITE_SUPABASE_URL: ${supabaseUrl ? 'Set' : 'MISSING'}
    VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'Set' : 'MISSING'}`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
