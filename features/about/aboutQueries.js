import "server-only";
import { createCachedQuery } from "@/lib/cache/cachedQuery";

// 페이지네이션이 없어서 상한을 둔다. 넘으면 오래된 항목은 목록에서 빠진다.
const MEMBER_LIMIT = 200;
const NEWS_LIMIT = 50;

export const getMembers = createCachedQuery("members-all", (supabase) =>
  supabase.from("members").select("id, department_id, name_ko, name_en, role_ko, role_en, bio_ko, bio_en").order("sort_order", { ascending: true }).order("created_at", { ascending: true }).limit(MEMBER_LIMIT)
);

// 상세 페이지도 이 목록에서 slug로 찾는다. 임의 주소로 캐시 항목이 늘어나지 않게 하려는 거야.
export const getAllNews = createCachedQuery("news-all", (supabase) =>
  supabase.from("news").select("id, slug, category, title_ko, title_en, body_ko, body_en, published_at").order("published_at", { ascending: false }).limit(NEWS_LIMIT)
);
