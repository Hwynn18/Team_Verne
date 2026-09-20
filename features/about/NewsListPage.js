import Link from "next/link";
import { getDictionary } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/localize";
import { formatDate } from "@/lib/i18n/formatDate";
import { getAllNews } from "./aboutQueries";
import { newsHref } from "./newsHref";
import CategoryBadge from "./CategoryBadge";
import AboutMessage from "./AboutMessage";
import styles from "./About.module.css";

export default async function NewsListPage() {
  const [{ locale, t }, result] = await Promise.all([getDictionary(), getAllNews()]);
  const labels = t.about.news;

  let body;
  if (result.failed) {
    body = <AboutMessage tone="error">{labels.loadError}</AboutMessage>;
  } else if (result.data.length === 0) {
    body = <AboutMessage>{labels.empty}</AboutMessage>;
  } else {
    body = (
      <ul className={styles.newsList}>
        {result.data.map((item) => (
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
    );
  }

  return (
    <main className={`${styles.page} ${styles.pageNarrow}`}>
      <h1 className={styles.title}>{t.nav.aboutNews}</h1>
      {body}
    </main>
  );
}
