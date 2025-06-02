import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single instance of the Supabase client
export const createClient = () => {
  // During static page generation, return a mock client
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return createClientComponentClient<Database>();
  }

  // For runtime, use the actual configuration
  return createClientComponentClient<Database>({
    supabaseUrl: supabaseUrl || '',
    supabaseKey: supabaseAnonKey || '',
  });
};

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
}; 