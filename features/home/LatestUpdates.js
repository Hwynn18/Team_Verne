import { formatDate } from "@/lib/i18n/formatDate";
import { pickLocalized } from "@/lib/i18n/localize";
import SectionMessage from "./SectionMessage";
import styles from "./Home.module.css";

function UpdatesBody({ result, locale, labels }) {
  if (result.failed) return <SectionMessage tone="error">{labels.loadError}</SectionMessage>;
  if (result.data.length === 0) return <SectionMessage>{labels.emptyUpdates}</SectionMessage>;

  return (
    <ul className={styles.updateList}>
      {result.data.map((item) => (
        <li key={item.id} className={styles.updateItem}>
          <time className={styles.updateDate} dateTime={item.published_at}>{formatDate(item.published_at, locale)}</time>
          <span className={styles.updateTitle}>{pickLocalized(item, "title", locale)}</span>
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
