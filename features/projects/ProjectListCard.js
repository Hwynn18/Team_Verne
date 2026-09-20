import Link from "next/link";
import { pickLocalized } from "@/lib/i18n/localize";
import { projectHref } from "./projectHref";
import { getCoverUrl } from "./coverUrl";
import CoverImage from "./CoverImage";
import StatusBadge from "./StatusBadge";
import DepartmentTags from "./DepartmentTags";
import styles from "./Projects.module.css";

export default function ProjectListCard({ project, locale, labels }) {
  const title = pickLocalized(project, "title", locale);
  const summary = pickLocalized(project, "summary", locale);

  return (
    <article className={styles.card}>
      <div className={styles.cardCover}>
        <CoverImage src={getCoverUrl(project.cover_path)} sizes="(max-width: 768px) 100vw, 340px" />
      </div>
      <div className={styles.cardBody}>
        <StatusBadge status={project.status} labels={labels} />
        <h2 className={styles.cardTitle}>
          <Link href={projectHref(project.slug)} className={styles.cardLink}>{title}</Link>
        </h2>
        <p className={styles.cardSummary}>{summary}</p>
        <DepartmentTags departments={project.departments} locale={locale} label={labels.departmentsLabel} />
      </div>
    </article>
  );
}
