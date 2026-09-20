import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PROJECT_COLUMNS = "id, slug, title_ko, title_en, summary_ko, summary_en";
const FEATURED_LIMIT = 3;
const NEWS_LIMIT = 5;

// 한 섹션이 실패해도 다른 섹션은 살아 있게, 실패는 { failed: true }로 돌려준다
async function run(label, buildQuery) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await buildQuery(supabase);
    if (error) throw error;
    return { data, failed: false };
  } catch (error) {
    console.error(`[home:${label}]`, error);
    return { data: [], failed: true };
  }
}

export function getActiveProject() {
  return run("active", (supabase) =>
    supabase.from("projects").select(PROJECT_COLUMNS).eq("status", "active").order("sort_order", { ascending: true }).order("created_at", { ascending: false }).limit(1)
  );
}

export function getFeaturedProjects() {
  return run("featured", (supabase) =>
    supabase.from("projects").select(PROJECT_COLUMNS).eq("is_featured", true).order("sort_order", { ascending: true }).order("created_at", { ascending: false }).limit(FEATURED_LIMIT)
  );
}

export function getLatestNews() {
  return run("news", (supabase) =>
    supabase.from("news").select("id, title_ko, title_en, published_at").order("published_at", { ascending: false }).limit(NEWS_LIMIT)
  );
}
