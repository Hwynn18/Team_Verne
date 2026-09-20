import { pickLocalized } from "@/lib/i18n/localize";
import styles from "./Projects.module.css";

export default function DepartmentTags({ departments, locale, label }) {
  if (departments.length === 0) return null;

  return (
    <ul className={styles.tagList} aria-label={label}>
      {departments.map((department) => (
        <li key={department.id} className={styles.tag}>{pickLocalized(department, "name", locale)}</li>
      ))}
    </ul>
  );
}
