import Image from "next/image";
import { getDictionary } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/localize";
import { getGalleryPhotos } from "./teamsQueries";
import { getGalleryPhotoUrl } from "./galleryPhotoUrl";
import TeamsMessage from "./TeamsMessage";
import styles from "./Teams.module.css";

function Body({ result, locale, labels }) {
  if (result.failed) return <TeamsMessage tone="error">{labels.loadError}</TeamsMessage>;
  if (result.data.length === 0) return <TeamsMessage>{labels.empty}</TeamsMessage>;

  return (
    <ul className={styles.galleryGrid}>
      {result.data.map((photo, index) => {
        const url = getGalleryPhotoUrl(photo.photo_path);
        if (!url) return null;
        const caption = pickLocalized(photo, "caption", locale);
        return (
          <li key={photo.id} className={styles.galleryItem}>
            {/* 원본이 수 MB라 next/image로 화면 크기에 맞춰 줄여 받는다. 첫 사진은 첫 화면(LCP)이라 바로 받는다.
                아래 캡션 문단이 설명이라 alt는 비워서 두 번 읽히지 않게 한다. */}
            <div className={styles.galleryFrame}>
              <Image src={url} alt="" fill sizes="(max-width: 768px) 100vw, 340px" loading={index === 0 ? "eager" : "lazy"} className={styles.galleryImage} />
            </div>
            {caption && <p className={styles.galleryCaption}>{caption}</p>}
          </li>
        );
      })}
    </ul>
  );
}

export default async function AmbiencePage() {
  const [{ locale, t }, result] = await Promise.all([getDictionary(), getGalleryPhotos()]);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{t.nav.teamsAmbience}</h1>
      <Body result={result} locale={locale} labels={t.teams.ambience} />
    </main>
  );
}
