import "server-only";
import { createCachedQuery } from "@/lib/cache/cachedQuery";
import { DEPARTMENT_COLUMNS } from "@/lib/data/departmentQueries";

// shortcut: 목록·상세가 한 조회를 같이 써서 목록에도 본문이 실린다. 프로젝트가 많아져 캐시가 무거워지면 상세 전용 조회로 나눈다.
const PROJECT_COLUMNS = "id, slug, title_ko, title_en, summary_ko, summary_en, body_ko, body_en, started_on, ended_on, status, is_featured, cover_path";
// 만든 사람을 파트 순서(기획 → 디자인 → 개발)로 정렬하려고 멤버의 파트 순서도 같이 읽는다
const MEMBER_COLUMNS = "id, name_ko, name_en, sort_order, departments(sort_order)";
const PROJECT_SELECT = `${PROJECT_COLUMNS}, project_departments(departments(${DEPARTMENT_COLUMNS})), project_members(members(${MEMBER_COLUMNS}))`;
// 페이지네이션이 없어서 상한을 둔다. 이 수를 넘으면 오래된 프로젝트는 목록/상세에서 빠진다.
const PROJECT_LIMIT = 200;

export const getAllProjects = createCachedQuery("projects-all", (supabase) =>
  supabase.from("projects").select(PROJECT_SELECT).order("sort_order", { ascending: true }).order("created_at", { ascending: false }).limit(PROJECT_LIMIT)
);
