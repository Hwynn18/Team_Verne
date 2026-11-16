import { pickLocalized } from "@/lib/i18n/localize";
import styles from "./Projects.module.css";

export default function ProjectMembers({ members, locale, label }) {
  if (members.length === 0) return null;

  return (
    <div className={styles.credits}>
      <span className={styles.creditsLabel}>{label}</span>
      <ul className={styles.creditList}>
        {members.map((member) => (
          <li key={member.id}>{pickLocalized(member, "name", locale)}</li>
        ))}
      </ul>
    </div>
  );
}
