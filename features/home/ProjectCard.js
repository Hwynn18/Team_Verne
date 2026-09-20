import Link from "next/link";
import { projectHref } from "@/features/projects/projectHref";
import { getCoverUrl } from "@/features/projects/coverUrl";
import CoverImage from "@/features/projects/CoverImage";
import { pickLocalized } from "./localize";
import styles from "./Home.module.css";

export default function ProjectCard({ project, locale }) {
  const title = pickLocalized(project, "title", locale);
  const summary = pickLocalized(project, "summary", locale);

  return (
    <article className={styles.card}>
      <div className={styles.cardCover}>
        <CoverImage src={getCoverUrl(project.cover_path)} sizes="(max-width: 768px) 100vw, 340px" />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>
          <Link href={projectHref(project.slug)} className={styles.cardLink}>{title}</Link>
        </h3>
        <p className={styles.cardSummary}>{summary}</p>
      </div>
    </article>
  );
}
