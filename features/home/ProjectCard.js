import Link from "next/link";
import { projectHref } from "@/features/projects/projectHref";
import { pickLocalized } from "./localize";
import styles from "./Home.module.css";

export default function ProjectCard({ project, locale }) {
  const title = pickLocalized(project, "title", locale);
  const summary = pickLocalized(project, "summary", locale);

  return (
    <article className={styles.card}>
      <h3 className={styles.cardTitle}>
        <Link href={projectHref(project.slug)} className={styles.cardLink}>{title}</Link>
      </h3>
      <p className={styles.cardSummary}>{summary}</p>
    </article>
  );
}
