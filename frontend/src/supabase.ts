import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not set. ' +
        'Create a project at https://supabase.com and add these to your .env.local file.'
    );
  }
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
} catch (err) {
  console.warn('[Supabase] Client initialization failed:', err);
  // Create a minimal stub so the app doesn't crash on import
  supabase = createClient('http://localhost', 'dummy-key');
}

export { supabase };

