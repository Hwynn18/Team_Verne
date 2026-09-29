import { getDictionary } from "@/lib/i18n/server";
import { formatDate } from "@/lib/i18n/formatDate";
import { getEntries } from "./guestbookQueries";
import GuestbookForm from "./GuestbookForm";
import DeleteEntryForm from "./DeleteEntryForm";
import styles from "./Guestbook.module.css";

function EntryList({ result, locale, labels }) {
  if (result.failed) return <p className={`${styles.message} ${styles.messageError}`}>{labels.loadError}</p>;
  if (result.data.length === 0) return <p className={styles.message}>{labels.empty}</p>;

  return (
    <ul className={styles.list}>
      {result.data.map((entry) => (
        <li key={entry.id} className={styles.entry}>
          <div className={styles.entryHead}>
            <span className={styles.nickname}>{entry.nickname}</span>
            <time className={styles.date} dateTime={entry.created_at}>{formatDate(entry.created_at, locale)}</time>
          </div>
          <p className={styles.entryMessage}>{entry.message}</p>
          <DeleteEntryForm id={entry.id} labels={labels} />
        </li>
      ))}
    </ul>
  );
}

export default async function GuestbookPage() {
  const [{ locale, t }, result] = await Promise.all([getDictionary(), getEntries()]);
  const labels = t.guestbook;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{t.nav.guestbook}</h1>
      <p className={styles.intro}>{labels.intro}</p>
      <GuestbookForm labels={labels} />
      <section aria-labelledby="guestbook-list">
        <h2 id="guestbook-list" className={styles.sectionTitle}>{labels.listTitle}</h2>
        <EntryList result={result} locale={locale} labels={labels} />
      </section>
    </main>
  );
}
