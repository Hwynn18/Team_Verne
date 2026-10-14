import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const GUESTBOOK_PAGE_SIZE = 10;

// 캐시하지 않는다. 글을 쓰자마자 목록에 보여야 해서.
// password_hash 는 절대 select 하지 않는다.
export async function getEntriesPage(page) {
  try {
    const db = createSupabaseAdminClient();
    const { count, error: countError } = await db.from("guestbook_entries").select("id", { count: "exact", head: true });
    if (countError) throw new Error(`${countError.code ?? "unknown"}: ${countError.message}`);
    // head 요청은 DB가 덜 켜졌을 때 에러 없이 count=null을 돌려줘서 "0개"로 둔갑하지 않게 막는다
    if (count === null) throw new Error("guestbook count is null");
    const total = count;

    const from = (page - 1) * GUESTBOOK_PAGE_SIZE;
    // 범위를 넘는 구간을 요청하면 Supabase가 PGRST103으로 거부해서 미리 걸러낸다
    if (total === 0 || from >= total) return { data: { items: [], total }, failed: false };

    const to = Math.min(from + GUESTBOOK_PAGE_SIZE - 1, total - 1);
    const { data, error } = await db.from("guestbook_entries").select("id, nickname, message, created_at").order("created_at", { ascending: false }).range(from, to);
    if (error) throw new Error(`${error.code ?? "unknown"}: ${error.message}`);
    return { data: { items: data, total }, failed: false };
  } catch (error) {
    console.error("[guestbook:list]", error);
    return { data: null, failed: true };
  }
}
