// 파트 순서(sort_order)대로, 멤버가 있는 파트만 돌려준다
export function groupMembersByDepartment(departments, members) {
  const byDepartment = new Map(departments.map((department) => [department.id, []]));
  for (const member of members) {
    const bucket = byDepartment.get(member.department_id);
    if (!bucket) {
      console.error("[groupMembers] unknown department for member", member.id);
      continue;
    }
    bucket.push(member);
  }
  return departments
    .map((department) => ({ department, members: byDepartment.get(department.id) }))
    .filter((group) => group.members.length > 0);
}
