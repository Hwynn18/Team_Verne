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
      <h1 className={styles.title}>{t.nav.aboutIntro}</h1>
      {SECTIONS.map((key) => (
        <section key={key} className={styles.introSection} aria-labelledby={`intro-${key}`}>
          <h2 id={`intro-${key}`} className={styles.sectionTitle}>{getText(labels, `${key}Title`)}</h2>
          <p className={styles.introText}>{getText(labels, key)}</p>
        </section>
      ))}
    </main>
  );
}
