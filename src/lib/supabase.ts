import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Public anon key — safe in the browser, protected by row-level security.
// Values come from .env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True when Supabase env vars are present. The app requires Supabase — no localStorage fallback. */
export const supabaseEnabled = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(url as string, anonKey as string, {
      // Persisted so an admin's Supabase Auth session survives a page reload.
      auth: { persistSession: true },
    })
  : null;
