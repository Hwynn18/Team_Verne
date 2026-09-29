import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// 페이지네이션이 없어서 최신 글만 보여준다
const ENTRY_LIMIT = 50;

// 캐시하지 않는다. 글을 쓰자마자 목록에 보여야 해서.
// password_hash 는 절대 select 하지 않는다.
export async function getEntries() {
  try {
    const db = createSupabaseAdminClient();
    const { data, error } = await db.from("guestbook_entries").select("id, nickname, message, created_at").order("created_at", { ascending: false }).limit(ENTRY_LIMIT);
    if (error) throw new Error(`${error.code ?? "unknown"}: ${error.message}`);
    return { data, failed: false };
  } catch (error) {
    console.error("[guestbook:list]", error);
    return { data: [], failed: true };
  }
}
