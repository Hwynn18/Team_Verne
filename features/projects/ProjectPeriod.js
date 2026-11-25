import { formatDate } from "@/lib/i18n/formatDate";
import styles from "./Projects.module.css";

// 시작일이 없으면 안 보여준다. 종료일이 없으면 "시작일 ~"로 열어 둔다.
export default function ProjectPeriod({ startedOn, endedOn, locale, label }) {
  if (!startedOn) return null;

  return (
    <div className={styles.credits}>
      <span className={styles.creditsLabel}>{label}</span>
      <span className={styles.period}>
        <time dateTime={startedOn}>{formatDate(startedOn, locale)}</time>
        {" ~ "}
        {endedOn && <time dateTime={endedOn}>{formatDate(endedOn, locale)}</time>}
      </span>
    </div>
  );
}
