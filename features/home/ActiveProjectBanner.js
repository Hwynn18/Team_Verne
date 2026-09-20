import Link from "next/link";
import { projectHref } from "@/features/projects/projectHref";
import { getCoverUrl } from "@/features/projects/coverUrl";
import CoverImage from "@/features/projects/CoverImage";
import { pickLocalized } from "./localize";
import SectionMessage from "./SectionMessage";
import styles from "./Home.module.css";

function BannerBody({ result, locale, labels }) {
  if (result.failed) return <SectionMessage tone="error">{labels.loadError}</SectionMessage>;
  const project = result.data[0];
  if (!project) return <SectionMessage>{labels.emptyActive}</SectionMessage>;

  return (
    <>
      <h3 className={styles.bannerTitle}>{pickLocalized(project, "title", locale)}</h3>
      <p className={styles.bannerSummary}>{pickLocalized(project, "summary", locale)}</p>
      <Link href={projectHref(project.slug)} className={styles.bannerAction}>{labels.viewProject}</Link>
    </>
  );
}

export default function ActiveProjectBanner({ result, locale, labels }) {
  const project = result.failed ? null : result.data[0];
  const coverUrl = project ? getCoverUrl(project.cover_path) : null;
  const className = coverUrl ? `${styles.banner} ${styles.bannerWithCover}` : styles.banner;

  return (
    <section className={className} aria-labelledby="home-active">
      <div className={styles.bannerText}>
        <h2 id="home-active" className={styles.bannerLabel}>{labels.activeTitle}</h2>
        <BannerBody result={result} locale={locale} labels={labels} />
      </div>
      {coverUrl && (
        <div className={styles.bannerCover}>
          <CoverImage src={coverUrl} sizes="(max-width: 768px) 100vw, 420px" eager />
        </div>
      )}
    </section>
  );
}
