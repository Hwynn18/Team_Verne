import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { getDictionary } from "@/lib/i18n/server";
import { getActiveProject, getFeaturedProjects, getLatestNews } from "./homeQueries";
import ActiveProjectBanner from "./ActiveProjectBanner";
import FeaturedProjects from "./FeaturedProjects";
import LatestUpdates from "./LatestUpdates";
import styles from "./Home.module.css";

export default async function HomePage() {
  const { locale, t } = await getDictionary();
  const [active, featured, news] = await Promise.all([getActiveProject(), getFeaturedProjects(), getLatestNews()]);

  return (
    <main className={styles.home}>
      <hgroup className={styles.hero}>
        <h1 className={styles.heroTitle}>{siteConfig.name}</h1>
        <p className={styles.heroSlogan}>{t.about.intro.sloganFull}</p>
        <Link href="/about/intro" className={styles.heroLink}>{t.home.introLink} →</Link>
      </hgroup>
      <ActiveProjectBanner result={active} locale={locale} labels={t.home} />
      <FeaturedProjects result={featured} locale={locale} labels={t.home} />
      <LatestUpdates result={news} locale={locale} labels={t.home} />
    </main>
  );
}
