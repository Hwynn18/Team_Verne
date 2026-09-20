import { siteConfig } from "@/lib/config/site";
import styles from "./Sidebar.module.css";

export default function InstagramLink({ label }) {
  return (
    <a className={styles.social} href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label={label}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
      <span>Instagram</span>
    </a>
  );
}
