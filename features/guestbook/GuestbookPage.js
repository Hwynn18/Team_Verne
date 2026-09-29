import { getDictionary } from "@/lib/i18n/server";
import { formatDate } from "@/lib/i18n/formatDate";
import { parsePage } from "@/lib/validation/page";
import Pagination from "@/lib/ui/Pagination";
import { getEntriesPage, GUESTBOOK_PAGE_SIZE } from "./guestbookQueries";
import GuestbookForm from "./GuestbookForm";
import DeleteEntryForm from "./DeleteEntryForm";
import styles from "./Guestbook.module.css";

function EntryList({ result, page, locale, labels }) {
  if (result.failed) return <p className={`${styles.message} ${styles.messageError}`}>{labels.loadError}</p>;

  const { items, total } = result.data;
  const totalPages = Math.max(1, Math.ceil(total / GUESTBOOK_PAGE_SIZE));
  if (items.length === 0) return <p className={styles.message}>{page > totalPages ? labels.emptyPage : labels.empty}</p>;

  return (
    <>
      <ul className={styles.list}>
        {items.map((entry) => (
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
      <Pagination basePath="/guestbook" page={page} totalPages={totalPages} labels={labels} />
    </>
  );
}

export default async function GuestbookPage({ searchParams }) {
  const [{ locale, t }, query] = await Promise.all([getDictionary(), searchParams]);
  const labels = t.guestbook;
  const page = parsePage(query.page);
  const result = await getEntriesPage(page);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{t.nav.guestbook}</h1>
      <p className={styles.intro}>{labels.intro}</p>
      <GuestbookForm labels={labels} />
      <section aria-labelledby="guestbook-list">
        <h2 id="guestbook-list" className={styles.sectionTitle}>{labels.listTitle}</h2>
        <EntryList result={result} page={page} locale={locale} labels={labels} />
      </section>
    </main>
  );
}
