import "server-only";
import { createCachedQuery } from "@/lib/cache/cachedQuery";

const PROJECT_COLUMNS = "id, slug, title_ko, title_en, summary_ko, summary_en, cover_path";
const FEATURED_LIMIT = 3;
const NEWS_LIMIT = 5;

export const getActiveProject = createCachedQuery("home-active", (supabase) =>
  supabase.from("projects").select(PROJECT_COLUMNS).eq("status", "active").order("sort_order", { ascending: true }).order("created_at", { ascending: false }).limit(1)
);

export const getFeaturedProjects = createCachedQuery("home-featured", (supabase) =>
  supabase.from("projects").select(PROJECT_COLUMNS).eq("is_featured", true).order("sort_order", { ascending: true }).order("created_at", { ascending: false }).limit(FEATURED_LIMIT)
);

export const getLatestNews = createCachedQuery("home-news", (supabase) =>
  supabase.from("news").select("id, slug, title_ko, title_en, published_at").order("published_at", { ascending: false }).limit(NEWS_LIMIT)
);
