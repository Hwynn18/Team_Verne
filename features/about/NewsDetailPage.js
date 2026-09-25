import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/localize";
import { formatDate } from "@/lib/i18n/formatDate";
import { isValidSlug } from "@/lib/validation/slug";
import { getNewsBySlug } from "./aboutQueries";
import CategoryBadge from "./CategoryBadge";
import NewsBody from "./NewsBody";
import AboutMessage from "./AboutMessage";
import styles from "./About.module.css";

function BackLink({ label }) {
  return <Link href="/about/news" className={styles.back}>{label}</Link>;
}

export default async function NewsDetailPage({ slug }) {
  if (!isValidSlug(slug)) notFound();

  const [{ locale, t }, result] = await Promise.all([getDictionary(), getNewsBySlug(slug)]);
  const labels = t.about.news;

  // 조회 실패는 404가 아니라 에러 안내로 보여준다. 없는 소식과 구분하려는 거야.
  if (result.failed) {
    return (
      <main className={`${styles.page} ${styles.pageNarrow}`}>
        <BackLink label={labels.backToList} />
        <AboutMessage tone="error">{labels.loadError}</AboutMessage>
      </main>
    );
  }

  const item = result.data;
  if (!item) notFound();

  const body = pickLocalized(item, "body", locale);

  return (
    <main className={`${styles.page} ${styles.pageNarrow}`}>
      <BackLink label={labels.backToList} />
      <div className={styles.newsMeta}>
        <CategoryBadge category={item.category} labels={labels} />
        <time className={styles.newsDate} dateTime={item.published_at}>{formatDate(item.published_at, locale)}</time>
      </div>
      <h1 className={styles.detailTitle}>{pickLocalized(item, "title", locale)}</h1>
      {body && <NewsBody markdown={body} />}
    </main>
  );
}
