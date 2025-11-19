// lib/supabase/client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

/**
 * createBrowserSupabaseClient (singleton)
 * Use this on the client (pages/components) only.
 */
export function getBrowserSupabase() {
  if (typeof window === 'undefined') {
    throw new Error('getBrowserSupabase() must be used in the browser.');
  }

  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.'
      );
    }
    supabase = createClient(url, key, {
      auth: {
        // Keep session in browser (default). Adjust if you use custom cookie strategies.
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabase;
}
