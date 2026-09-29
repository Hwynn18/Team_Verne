import Link from "next/link";
import { getDictionary } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/localize";
import { formatDate } from "@/lib/i18n/formatDate";
import { parsePage } from "@/lib/validation/page";
import Pagination from "@/lib/ui/Pagination";
import { getNewsPage, NEWS_PAGE_SIZE } from "./aboutQueries";
import { newsHref } from "./newsHref";
import CategoryBadge from "./CategoryBadge";
import AboutMessage from "./AboutMessage";
import styles from "./About.module.css";

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
          <Pagination basePath="/about/news" page={page} totalPages={totalPages} labels={labels} />
        </>
      );
    }
  }

  return (
    <main className={`${styles.page} ${styles.pageNarrow}`}>
      <hgroup>
        <p className="eyebrow">{t.nav.about}</p>
        <h1 className={styles.title}>{t.nav.aboutNews}</h1>
      </hgroup>
      {body}
    </main>
  );
}
