import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/localize";
import { getAllProjects } from "./projectQueries";
import { normalizeProjects } from "./normalizeProjects";
import { isValidSlug } from "@/lib/validation/slug";
import { getCoverUrl } from "./coverUrl";
import CoverImage from "./CoverImage";
import StatusBadge from "./StatusBadge";
import DepartmentTags from "./DepartmentTags";
import ProjectsMessage from "./ProjectsMessage";
import styles from "./Projects.module.css";

function BackLink({ label }) {
  return <Link href="/projects" className={styles.back}>{label}</Link>;
}

export default async function ProjectDetailPage({ slug }) {
  if (!isValidSlug(slug)) notFound();

  const [{ locale, t }, result] = await Promise.all([getDictionary(), getAllProjects()]);
  const labels = t.projects;

  // 조회 실패는 404가 아니라 에러 안내로 보여준다. 없는 프로젝트와 구분하려는 거야.
  if (result.failed) {
    return (
      <main className={styles.detail}>
        <BackLink label={labels.backToList} />
        <ProjectsMessage tone="error">{labels.loadError}</ProjectsMessage>
      </main>
    );
  }

  const project = normalizeProjects(result.data).find((item) => item.slug === slug);
  if (!project) notFound();

  const coverUrl = getCoverUrl(project.cover_path);

  return (
    <main className={styles.detail}>
      <BackLink label={labels.backToList} />
      {coverUrl && (
        <div className={styles.detailCover}>
          <CoverImage src={coverUrl} sizes="(max-width: 768px) 100vw, 860px" eager />
        </div>
      )}
      <h1 className={styles.detailTitle}>{pickLocalized(project, "title", locale)}</h1>
      <div className={styles.detailMeta}>
        <StatusBadge status={project.status} labels={labels} />
        <DepartmentTags departments={project.departments} locale={locale} label={labels.departmentsLabel} />
      </div>
      <p className={styles.detailSummary}>{pickLocalized(project, "summary", locale)}</p>
    </main>
  );
}
