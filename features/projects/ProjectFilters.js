import Link from "next/link";
import { pickLocalized } from "@/lib/i18n/localize";
import { STATUS_VALUES, STATUS_LABEL_KEYS, buildFilterHref } from "./projectFilters";
import styles from "./Projects.module.css";

function Chip({ href, active, children }) {
  const className = active ? `${styles.chip} ${styles.chipActive}` : styles.chip;
  return <Link href={href} className={className} aria-current={active ? "true" : undefined}>{children}</Link>;
}

export default function ProjectFilters({ filters, departments, locale, labels }) {
  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup} role="group" aria-label={labels.filterStatusLabel}>
        <span className={styles.filterName} aria-hidden="true">{labels.filterStatusLabel}</span>
        <Chip href={buildFilterHref({ ...filters, status: null })} active={!filters.status}>{labels.filterAll}</Chip>
        {STATUS_VALUES.map((status) => (
          <Chip key={status} href={buildFilterHref({ ...filters, status })} active={filters.status === status}>{labels[STATUS_LABEL_KEYS[status]]}</Chip>
        ))}
      </div>
      <div className={styles.filterGroup} role="group" aria-label={labels.filterDepartmentLabel}>
        <span className={styles.filterName} aria-hidden="true">{labels.filterDepartmentLabel}</span>
        <Chip href={buildFilterHref({ ...filters, dept: null })} active={!filters.dept}>{labels.filterAll}</Chip>
        {departments.map((department) => (
          <Chip key={department.id} href={buildFilterHref({ ...filters, dept: department.slug })} active={filters.dept === department.slug}>{pickLocalized(department, "name", locale)}</Chip>
        ))}
      </div>
    </div>
  );
}
