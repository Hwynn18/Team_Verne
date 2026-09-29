import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getEnv, getServiceRoleKey } from "@/lib/config/env";

// RLS를 무시한다. 입력 검증을 마친 서버 코드(Server Action)에서만 쓴다.
export function createSupabaseAdminClient() {
  const { supabaseUrl } = getEnv();
  return createClient(supabaseUrl, getServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
