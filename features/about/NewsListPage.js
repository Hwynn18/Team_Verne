import Link from "next/link";
import { getDictionary } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/localize";
import { formatDate } from "@/lib/i18n/formatDate";
import { parsePage } from "@/lib/validation/page";
import { getNewsPage, NEWS_PAGE_SIZE } from "./aboutQueries";
import { newsHref, newsListHref } from "./newsHref";
import CategoryBadge from "./CategoryBadge";
import AboutMessage from "./AboutMessage";
import styles from "./About.module.css";

function PageNav({ page, totalPages, labels }) {
  return (
    <nav className={styles.pagination} aria-label={labels.paginationLabel}>
      {page > 1 ? (
        <Link href={newsListHref(page - 1)} className={styles.pageLink}>{labels.prevPage}</Link>
      ) : (
        <span className={styles.pageLinkDisabled} aria-hidden="true">{labels.prevPage}</span>
      )}
      <span className={styles.pageStatus}>{labels.pageStatus.replace("{current}", page).replace("{total}", totalPages)}</span>
      {page < totalPages ? (
        <Link href={newsListHref(page + 1)} className={styles.pageLink}>{labels.nextPage}</Link>
      ) : (
        <span className={styles.pageLinkDisabled} aria-hidden="true">{labels.nextPage}</span>
      )}
    </nav>
  );
}

export default async function NewsListPage({ searchParams }) {
  const [{ locale, t }, query] = await Promise.all([getDictionary(), searchParams]);
  const labels = t.about.news;
  const page = parsePage(query.page);
  const result = await getNewsPage(page);

  let body;
  if (result.failed) {
    body = <AboutMessage tone="error">{labels.loadError}</AboutMessage>;
  } else {
    const { items, total } = result.data;
    const totalPages = Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE));
    if (items.length === 0) {
      body = <AboutMessage>{page > totalPages ? labels.emptyPage : labels.empty}</AboutMessage>;
    } else {
      body = (
        <>
          <ul className={styles.newsList}>
            {items.map((item) => (
              <li key={item.id}>
                <Link href={newsHref(item.slug)} className={styles.newsLink}>
                  <span className={styles.newsMeta}>
                    <CategoryBadge category={item.category} labels={labels} />
                    <time className={styles.newsDate} dateTime={item.published_at}>{formatDate(item.published_at, locale)}</time>
                  </span>
                  <span className={styles.newsTitle}>{pickLocalized(item, "title", locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
          {totalPages > 1 && <PageNav page={page} totalPages={totalPages} labels={labels} />}
        </>
      );
    }
  }

  return (
    <main className={`${styles.page} ${styles.pageNarrow}`}>
      <h1 className={styles.title}>{t.nav.aboutNews}</h1>
      {body}
    </main>
  );
}
