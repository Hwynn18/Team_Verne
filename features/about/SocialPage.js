import { siteConfig } from "@/lib/config/site";
import { getDictionary } from "@/lib/i18n/server";
import { getInstagramHandle } from "./instagram";
import InstagramEmbed from "./InstagramEmbed";
import AboutMessage from "./AboutMessage";
import styles from "./About.module.css";

export default async function SocialPage() {
  const { t } = await getDictionary();
  const labels = t.about.social;
  const profileUrl = siteConfig.social.instagram;
  const handle = getInstagramHandle(profileUrl);

  return (
    <main className={`${styles.page} ${styles.pageNarrow}`}>
      <h1 className={styles.title}>{t.nav.aboutSocial}</h1>
      <p className={styles.socialDesc}>{labels.description}</p>
      {handle ? (
        <>
          <InstagramEmbed handle={handle} title={labels.embedTitle} />
          <p className={styles.socialDesc}>{labels.embedHint}</p>
          <a className={styles.externalLink} href={profileUrl} target="_blank" rel="noopener noreferrer">{labels.openInstagram}</a>
        </>
      ) : (
        <AboutMessage>{labels.notConnected}</AboutMessage>
      )}
    </main>
  );
}
