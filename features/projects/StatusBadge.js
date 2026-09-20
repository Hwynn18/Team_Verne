import { STATUS_LABEL_KEYS } from "./projectFilters";
import styles from "./Projects.module.css";

export default function StatusBadge({ status, labels }) {
  const key = STATUS_LABEL_KEYS[status];
  if (!key) {
    throw new Error(`Unknown project status: ${status}`);
  }
  const className = status === "active" ? `${styles.badge} ${styles.badgeActive}` : styles.badge;
  return <span className={className}>{labels[key]}</span>;
}
