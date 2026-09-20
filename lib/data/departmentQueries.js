import "server-only";
import { createCachedQuery } from "@/lib/cache/cachedQuery";

export const DEPARTMENT_COLUMNS = "id, slug, name_ko, name_en, sort_order";

export const getDepartments = createCachedQuery("departments-all", (supabase) =>
  supabase.from("departments").select(DEPARTMENT_COLUMNS).order("sort_order", { ascending: true })
);
