import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://dwdzvxghcdxnakaoxxke.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_BZXwzUYSky1HIQhjhpSfBQ_6ja89POfY';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseKey) return false;
  // A valid Supabase anon key is a signed JWT (starts with 'eyJ' and has 3 parts separated by dots)
  const isJwt =
    typeof supabaseKey === 'string' &&
    supabaseKey.startsWith('eyJ') &&
    supabaseKey.split('.').length === 3;
  return isJwt;
};

export const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
};
