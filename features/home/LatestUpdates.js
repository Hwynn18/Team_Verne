import Link from "next/link";
import { formatDate } from "@/lib/i18n/formatDate";
import { pickLocalized } from "@/lib/i18n/localize";
import { isValidSlug } from "@/lib/validation/slug";
import { newsHref } from "@/features/about/newsHref";
import SectionMessage from "./SectionMessage";
import styles from "./Home.module.css";

// slug가 없거나 형식이 틀리면 링크 없이 제목만 보여준다 (페이지 전체를 막지 않는다)
function UpdateTitle({ item, locale }) {
  const title = pickLocalized(item, "title", locale);
  if (!isValidSlug(item.slug)) {
    console.error("[LatestUpdates] missing or invalid slug for news", item.id);
    return <span className={styles.updateTitle}>{title}</span>;
  }
  return <Link href={newsHref(item.slug)} className={`${styles.updateTitle} ${styles.updateLink}`}>{title}</Link>;
}

function UpdatesBody({ result, locale, labels }) {
  if (result.failed) return <SectionMessage tone="error">{labels.loadError}</SectionMessage>;
  if (result.data.length === 0) return <SectionMessage>{labels.emptyUpdates}</SectionMessage>;

  return (
    <ul className={styles.updateList}>
      {result.data.map((item) => (
        <li key={item.id} className={styles.updateItem}>
          <time className={styles.updateDate} dateTime={item.published_at}>{formatDate(item.published_at, locale)}</time>
          <UpdateTitle item={item} locale={locale} />
        </li>
      ))}
    </ul>
  );
}

export default function LatestUpdates({ result, locale, labels }) {
  return (
    <section aria-labelledby="home-updates">
      <h2 id="home-updates" className={styles.sectionTitle}>{labels.updatesTitle}</h2>
      <UpdatesBody result={result} locale={locale} labels={labels} />
    </section>
  );
}
