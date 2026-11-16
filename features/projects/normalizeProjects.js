// 연결 테이블 행(links[].<key>)을 compare 순 배열로 펼친다. 대상이 없는 연결은 로그만 남기고 건너뛴다.
function flattenLinks(links, key, projectId, compare) {
  const items = [];
  for (const link of links ?? []) {
    if (!link[key]) {
      console.error(`[normalizeProjects] ${key} missing for project`, projectId);
      continue;
    }
    items.push(link[key]);
  }
  return items.sort(compare);
}

const bySortOrder = (a, b) => a.sort_order - b.sort_order;

// 파트 순서 먼저, 같은 파트 안에서는 멤버 순서. 파트가 없는 멤버는 맨 뒤.
const byDepartmentThenSortOrder = (a, b) =>
  (a.departments?.sort_order ?? Infinity) - (b.departments?.sort_order ?? Infinity) || bySortOrder(a, b);

// 조회 결과의 project_departments / project_members 를 project.departments / project.members 배열로 펼친다
export function normalizeProjects(rows) {
  return rows.map((row) => {
    const { project_departments: departmentLinks, project_members: memberLinks, ...project } = row;
    return {
      ...project,
      departments: flattenLinks(departmentLinks, "departments", row.id, bySortOrder),
      members: flattenLinks(memberLinks, "members", row.id, byDepartmentThenSortOrder),
    };
  });
}
