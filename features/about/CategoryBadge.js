import { CATEGORY_LABEL_KEYS } from "./newsCategories";
import styles from "./About.module.css";

export default function CategoryBadge({ category, labels }) {
  const key = CATEGORY_LABEL_KEYS[category];
  if (!key) {
    throw new Error(`Unknown news category: ${category}`);
  }
  const className = category === "release" ? `${styles.badge} ${styles.badgeRelease}` : styles.badge;
  return <span className={className}>{labels[key]}</span>;
}
