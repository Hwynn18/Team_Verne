import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/config/env";

export function createSupabaseServerClient() {
  const { supabaseUrl, supabaseAnonKey } = getEnv();
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
