import { getDictionary } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/config/site";
import { getGalleryPhotoUrl } from "@/features/teams/galleryPhotoUrl";
import { Reveal, ParallaxPhoto } from "./IntroMotion";
import styles from "./About.module.css";

// 사진은 Supabase team-gallery 버킷에 이 이름으로 올린다(DB 등록 없음). 없으면 회색 자리로 보인다.
const PHOTOS = {
  about: ["about-1.jpg"],
  mission: ["mission-1.jpg", "mission-2.jpg"],
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
      <p className={`eyebrow ${styles.introLabel}`}>{getText(labels, `${id}Title`)}</p>
      <h2 className={styles.introHeadline}>{getText(labels, `${id}Headline`)}</h2>
      <p className={styles.introText}>{getText(labels, id)}</p>
    </Reveal>
  );
}

function Photos({ fileNames }) {
  return (
    <div className={styles.introPhotos} data-count={fileNames.length}>
      {fileNames.map((fileName) => (
        <ParallaxPhoto key={fileName} src={getGalleryPhotoUrl(fileName)} sizes={fileNames.length > 1 ? "(max-width: 768px) 100vw, 540px" : "(max-width: 768px) 100vw, 1080px"} />
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
      {/* JS가 없으면 Reveal의 처음 상태(투명)가 풀리지 않으니 바로 보이게 한다 */}
      <noscript>
        <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
      </noscript>
      <hgroup className={styles.introHero}>
        <p className="eyebrow">{t.nav.aboutIntro}</p>
        <h1 className={styles.introSlogan}>{siteConfig.name}</h1>
        <p className={styles.introSloganFull}>{sloganFull}</p>
      </hgroup>

      <Section id="about" labels={labels} />
      <Photos fileNames={PHOTOS.about} />
      <Section id="question" labels={labels} />
      <Section id="mission" labels={labels} />
      <Photos fileNames={PHOTOS.mission} />

      <Reveal as="section" className={`${styles.introSection} ${styles.introManifesto}`}>
        <p className={`eyebrow ${styles.introLabel}`}>{getText(labels, "manifestoTitle")}</p>
        <h2 className={styles.introHeadline}>{getText(labels, "manifestoHeadline")}</h2>
        <p className={styles.introText}>{getText(labels, "manifesto")}</p>
        <p className={styles.introManifestoClosing}>{sloganFull}</p>
      </Reveal>
    </main>
  );
}
