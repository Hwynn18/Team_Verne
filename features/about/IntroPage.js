import { getDictionary } from "@/lib/i18n/server";
import styles from "./About.module.css";

const SECTIONS = ["vision", "purpose", "direction"];

function getText(labels, key) {
  const value = labels[key];
  if (!value) {
    throw new Error(`Missing about.intro label: ${key}`);
  }
  return value;
}

export default async function IntroPage() {
  const { t } = await getDictionary();
  const labels = t.about.intro;

  return (
    <main className={`${styles.page} ${styles.pageNarrow}`}>
      <hgroup>
        <p className="eyebrow">{t.nav.about}</p>
        <h1 className={styles.title}>{t.nav.aboutIntro}</h1>
      </hgroup>
      {SECTIONS.map((key) => (
        <section key={key} className={styles.introSection} aria-labelledby={`intro-${key}`}>
          <h2 id={`intro-${key}`} className={`eyebrow ${styles.introLabel}`}>{getText(labels, `${key}Title`)}</h2>
          <p className={styles.introHeadline}>{getText(labels, `${key}Headline`)}</p>
          <p className={styles.introText}>{getText(labels, key)}</p>
        </section>
      ))}
    </main>
  );
}
