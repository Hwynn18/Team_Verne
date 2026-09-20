import "server-only";
import { createCachedQuery } from "@/lib/cache/cachedQuery";

const PROJECT_COLUMNS = "id, slug, title_ko, title_en, summary_ko, summary_en, status, is_featured, cover_path";
const DEPARTMENT_COLUMNS = "id, slug, name_ko, name_en, sort_order";
const PROJECT_SELECT = `${PROJECT_COLUMNS}, project_departments(departments(${DEPARTMENT_COLUMNS}))`;
// 페이지네이션이 없어서 상한을 둔다. 이 수를 넘으면 오래된 프로젝트는 목록/상세에서 빠진다.
const PROJECT_LIMIT = 200;

export const getAllProjects = createCachedQuery("projects-all", (supabase) =>
  supabase.from("projects").select(PROJECT_SELECT).order("sort_order", { ascending: true }).order("created_at", { ascending: false }).limit(PROJECT_LIMIT)
);

export const getDepartments = createCachedQuery("departments-all", (supabase) =>
  supabase.from("departments").select(DEPARTMENT_COLUMNS).order("sort_order", { ascending: true })
);
