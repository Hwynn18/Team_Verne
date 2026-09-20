import { getDictionary } from "@/lib/i18n/server";
import { getAllProjects, getDepartments } from "./projectQueries";
import { normalizeProjects } from "./normalizeProjects";
import { parseFilters, applyFilters } from "./projectFilters";
import ProjectFilters from "./ProjectFilters";
import ProjectListCard from "./ProjectListCard";
import ProjectsMessage from "./ProjectsMessage";
import styles from "./Projects.module.css";

function ListBody({ projects, hasFilter, locale, labels }) {
  if (projects.length === 0) {
    return <ProjectsMessage>{hasFilter ? labels.emptyFiltered : labels.emptyAll}</ProjectsMessage>;
  }
  return (
    <ul className={styles.grid}>
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectListCard project={project} locale={locale} labels={labels} />
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectsPage({ searchParams }) {
  const [{ locale, t }, query, projectsResult, departmentsResult] = await Promise.all([getDictionary(), searchParams, getAllProjects(), getDepartments()]);
  const labels = t.projects;

  // 둘 중 하나라도 실패하면 필터를 만들 수 없으니 목록 전체를 안내 문구로 대체한다
  if (projectsResult.failed || departmentsResult.failed) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>{t.nav.projects}</h1>
        <ProjectsMessage tone="error">{labels.loadError}</ProjectsMessage>
      </main>
    );
  }

  const departments = departmentsResult.data;
  const filters = parseFilters(query, departments);
  const visible = applyFilters(normalizeProjects(projectsResult.data), filters);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{t.nav.projects}</h1>
      <ProjectFilters filters={filters} departments={departments} locale={locale} labels={labels} />
      <ListBody projects={visible} hasFilter={Boolean(filters.status || filters.dept)} locale={locale} labels={labels} />
    </main>
  );
}
