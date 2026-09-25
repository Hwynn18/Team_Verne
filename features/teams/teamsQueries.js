import "server-only";
import { createCachedQuery } from "@/lib/cache/cachedQuery";

// 페이지네이션이 없어서 상한을 둔다. 넘으면 오래된 항목은 빠진다.
const HISTORY_LIMIT = 100;
const GALLERY_LIMIT = 100;

export const getHistoryEvents = createCachedQuery("history-all", (supabase) =>
  supabase.from("history_events").select("id, event_date, title_ko, title_en, description_ko, description_en").order("sort_order", { ascending: true }).order("event_date", { ascending: true }).limit(HISTORY_LIMIT)
);

export const getGalleryPhotos = createCachedQuery("gallery-all", (supabase) =>
  supabase.from("gallery_photos").select("id, photo_path, caption_ko, caption_en").order("sort_order", { ascending: true }).order("created_at", { ascending: true }).limit(GALLERY_LIMIT)
);
