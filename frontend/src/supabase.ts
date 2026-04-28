import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are placeholder values or invalid
const isPlaceholder = 
  !supabaseUrl || 
  !supabaseAnonKey || 
  supabaseUrl.includes('YOUR_SUPABASE') || 
  supabaseAnonKey.includes('YOUR_SUPABASE') ||
  supabaseAnonKey.includes('YOUR_ACTUAL_ANON_KEY_HERE') ||
  supabaseAnonKey === supabaseUrl || // Check if anon key is same as URL (your current issue)
  !supabaseAnonKey.startsWith('eyJ'); // Anon keys should start with 'eyJ'

let supabase: SupabaseClient;
export let isSupabaseConfigured = false;

if (isPlaceholder) {
  console.warn(
    '%c⚠️ Supabase Not Configured',
    'color: #f59e0b; font-size: 14px; font-weight: bold;',
    '\n\nAdd your credentials to frontend/.env.local:\n' +
    '  VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n\n' +
    'Get them from: https://supabase.com/dashboard → Settings → API\n'
  );
  // Create a dummy client that won't cause errors
  supabase = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg1NzYwMDAsImV4cCI6MjAwNDEzMjAwMH0.placeholder');
  isSupabaseConfigured = false;
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    isSupabaseConfigured = true;
    console.log('%c✅ Supabase Connected', 'color: #10b981; font-size: 14px; font-weight: bold;');
  } catch (err) {
    console.error('[Supabase] Client initialization failed:', err);
    supabase = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg1NzYwMDAsImV4cCI6MjAwNDEzMjAwMH0.placeholder');
    isSupabaseConfigured = false;
  }
}

export { supabase };

