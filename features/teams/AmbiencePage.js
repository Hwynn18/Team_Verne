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
      {result.data.map((photo) => {
        const url = getGalleryPhotoUrl(photo.photo_path);
        if (!url) return null;
        const caption = pickLocalized(photo, "caption", locale);
        return (
          <li key={photo.id} className={styles.galleryItem}>
            {/* 장식적인 갤러리 사진이라 next/image 대신 일반 img를 쓴다. 캡션이 대체 텍스트를 대신한다. */}
            <img src={url} alt={caption} loading="lazy" className={styles.galleryImage} />
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
