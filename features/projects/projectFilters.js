// DB의 projects.status check 제약과 같은 값이어야 함
export const STATUS_LABEL_KEYS = { active: "statusActive", completed: "statusCompleted" };
export const STATUS_VALUES = Object.keys(STATUS_LABEL_KEYS);

function single(value) {
  return typeof value === "string" ? value : null;
}

// 허용 목록에 없는 값(임의 문자열, 중복 파라미터)은 "필터 없음"으로 취급한다
export function parseFilters(searchParams, departments) {
  const status = single(searchParams.status);
  const dept = single(searchParams.dept);
  return {
    status: STATUS_VALUES.includes(status) ? status : null,
    dept: departments.some((department) => department.slug === dept) ? dept : null,
  };
}

export function applyFilters(projects, { status, dept }) {
  return projects.filter((project) => (!status || project.status === status) && (!dept || project.departments.some((department) => department.slug === dept)));
}

export function buildFilterHref({ status, dept }) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (dept) params.set("dept", dept);
  const query = params.toString();
  return query ? `/projects?${query}` : "/projects";
}
