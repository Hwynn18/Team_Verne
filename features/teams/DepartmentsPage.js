import { getDictionary } from "@/lib/i18n/server";
import { getDepartments } from "@/lib/data/departmentQueries";
import { getMembers } from "@/features/about/aboutQueries";
import { groupMembersByDepartment } from "@/features/about/groupMembers";
import DepartmentSection from "./DepartmentSection";
import TeamsMessage from "./TeamsMessage";
import styles from "./Teams.module.css";

export default async function DepartmentsPage() {
  const [{ locale, t }, departmentsResult, membersResult] = await Promise.all([getDictionary(), getDepartments(), getMembers()]);
  const labels = t.teams.department;

  if (departmentsResult.failed || membersResult.failed) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>{t.nav.teamsDepartment}</h1>
        <TeamsMessage tone="error">{labels.loadError}</TeamsMessage>
      </main>
    );
  }

  // 멤버가 있는 파트만 보여준다. groupMembersByDepartment 는 About의 멤버 소개와 같은 로직을 쓴다.
  const groups = groupMembersByDepartment(departmentsResult.data, membersResult.data);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{t.nav.teamsDepartment}</h1>
      {groups.map(({ department, members }, index) => (
        <DepartmentSection key={department.id} department={department} members={members} index={index} labels={labels} locale={locale} />
      ))}
    </main>
  );
}
