import { getDictionary } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/config/site";
import { Reveal, ParallaxPhoto } from "./IntroMotion";
import styles from "./About.module.css";

// 사진은 public/about/ 에 이 이름으로 넣는다. 없으면 회색 자리로 보인다.
const PHOTOS = {
  about: ["/about/about-1.jpg"],
  mission: ["/about/mission-1.jpg", "/about/mission-2.jpg"],
};

function getText(labels, key) {
  const value = labels[key];
  if (!value) {
    throw new Error(`Missing about.intro label: ${key}`);
  }
  return value;
}

function Section({ id, labels }) {
  return (
    <Reveal as="section" className={styles.introSection}>
      <h2 className={`eyebrow ${styles.introLabel}`}>{getText(labels, `${id}Title`)}</h2>
      <p className={styles.introHeadline}>{getText(labels, `${id}Headline`)}</p>
      <p className={styles.introText}>{getText(labels, id)}</p>
    </Reveal>
  );
}

function Photos({ srcs }) {
  return (
    <div className={styles.introPhotos} data-count={srcs.length}>
      {srcs.map((src) => (
        <ParallaxPhoto key={src} src={src} sizes={srcs.length > 1 ? "(max-width: 768px) 100vw, 540px" : "(max-width: 768px) 100vw, 1080px"} />
      ))}
    </div>
  );
}

export default async function IntroPage() {
  const { t } = await getDictionary();
  const labels = t.about.intro;
  const sloganFull = getText(labels, "sloganFull");

  return (
    <main className={styles.page}>
      <hgroup className={styles.introHero}>
        <p className="eyebrow">{t.nav.aboutIntro}</p>
        <h1 className={styles.introSlogan}>{siteConfig.name}</h1>
        <p className={styles.introSloganFull}>{sloganFull}</p>
      </hgroup>

      <Section id="about" labels={labels} />
      <Photos srcs={PHOTOS.about} />
      <Section id="question" labels={labels} />
      <Section id="mission" labels={labels} />
      <Photos srcs={PHOTOS.mission} />

      <Reveal as="section" className={`${styles.introSection} ${styles.introManifesto}`}>
        <h2 className={`eyebrow ${styles.introLabel}`}>{getText(labels, "manifestoTitle")}</h2>
        <p className={styles.introHeadline}>{getText(labels, "manifestoHeadline")}</p>
        <p className={styles.introText}>{getText(labels, "manifesto")}</p>
        <p className={styles.introManifestoClosing}>{sloganFull}</p>
      </Reveal>
    </main>
  );
}
