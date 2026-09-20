// 조회 결과의 project_departments[].departments 를 project.departments 배열로 펼친다
export function normalizeProjects(rows) {
  return rows.map((row) => {
    const departments = [];
    for (const link of row.project_departments ?? []) {
      if (!link.departments) {
        console.error("[normalizeProjects] department missing for project", row.id);
        continue;
      }
      departments.push(link.departments);
    }
    departments.sort((a, b) => a.sort_order - b.sort_order);
    const { project_departments: _links, ...project } = row;
    return { ...project, departments };
  });
}
