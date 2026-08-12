import { createClient } from "@supabase/supabase-js";

// Public client — safe to use in browser/client components.
// Can only read data (RLS only grants SELECT to this key).
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
