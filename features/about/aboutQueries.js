import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCachedQuery, createCachedFn } from "@/lib/cache/cachedQuery";

// 페이지네이션이 없어서 상한을 둔다. 넘으면 오래된 멤버는 목록에서 빠진다.
const MEMBER_LIMIT = 200;
export const NEWS_PAGE_SIZE = 10;

export const getMembers = createCachedQuery("members-all", (supabase) =>
  supabase.from("members").select("id, department_id, name_ko, name_en, role_ko, role_en, bio_ko, bio_en, photo_path").order("sort_order", { ascending: true }).order("created_at", { ascending: true }).limit(MEMBER_LIMIT)
);

export const getNewsPage = createCachedFn("news-page", async (page) => {
  const supabase = createSupabaseServerClient();

  // 전체 개수를 먼저 확인한다. 목록을 새로 안 가져오는 가벼운 조회다.
  const { count, error: countError } = await supabase.from("news").select("id", { count: "exact", head: true });
  if (countError) throw new Error(`${countError.code ?? "unknown"}: ${countError.message}`);
  const total = count ?? 0;

  const from = (page - 1) * NEWS_PAGE_SIZE;
  // 요청한 구간이 전체를 넘으면 .range()를 호출하지 않는다. Supabase가 이 경우 PGRST103으로 거부하기 때문이다.
  if (total === 0 || from >= total) {
    return { items: [], total };
  }

  const to = Math.min(from + NEWS_PAGE_SIZE - 1, total - 1);
  const { data, error } = await supabase
    .from("news")
    .select("id, slug, category, title_ko, title_en, published_at")
    .order("published_at", { ascending: false })
    .range(from, to);
  if (error) throw new Error(`${error.code ?? "unknown"}: ${error.message}`);
  return { items: data, total };
});

// 상세 페이지는 목록 조회에 기대지 않고 slug 하나만 가져온다. 목록 상한(NEWS_PAGE_SIZE)과 무관하게 항상 접근된다.
export const getNewsBySlug = createCachedFn("news-by-slug", async (slug) => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("news")
    .select("id, slug, category, title_ko, title_en, body_ko, body_en, published_at")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`${error.code ?? "unknown"}: ${error.message}`);
  return data;
});
