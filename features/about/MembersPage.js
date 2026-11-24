import { getDictionary } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/localize";
import { getDepartments } from "@/lib/data/departmentQueries";
import { getMembers } from "./aboutQueries";
import { groupMembersByDepartment } from "./groupMembers";
import MemberCard from "./MemberCard";
import AboutMessage from "./AboutMessage";
import styles from "./About.module.css";

export default async function MembersPage() {
  const [{ locale, t }, membersResult, departmentsResult] = await Promise.all([getDictionary(), getMembers(), getDepartments()]);
  const labels = t.about.members;

  // 멤버나 파트 조회가 하나라도 실패하면 묶을 수 없으니 안내 문구로 대체한다
  if (membersResult.failed || departmentsResult.failed) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>{t.nav.aboutMembers}</h1>
        <AboutMessage tone="error">{labels.loadError}</AboutMessage>
      </main>
    );
  }

  const groups = groupMembersByDepartment(departmentsResult.data, membersResult.data);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{t.nav.aboutMembers}</h1>
      {groups.length === 0 ? (
        <AboutMessage>{labels.emptyMembers}</AboutMessage>
      ) : (
        groups.map(({ department, members }) => (
          <section key={department.id} aria-labelledby={`department-${department.slug}`}>
            <h2 id={`department-${department.slug}`} className={styles.sectionTitle}>{pickLocalized(department, "name", locale)}</h2>
            <ul className={styles.memberGrid}>
              {members.map((member) => (
                <li key={member.id}>
                  <MemberCard member={member} locale={locale} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </main>
  );
}
