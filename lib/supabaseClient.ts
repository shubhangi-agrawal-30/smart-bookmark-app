import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for browser usage.
 * Handles session persistence automatically.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);