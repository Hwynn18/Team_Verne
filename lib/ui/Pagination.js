import Link from "next/link";
import styles from "./Pagination.module.css";

function pageHref(basePath, page) {
  return page > 1 ? `${basePath}?page=${page}` : basePath;
}

// labels: { paginationLabel, prevPage, nextPage, pageStatus("{current}", "{total}" 포함) }
export default function Pagination({ basePath, page, totalPages, labels }) {
  if (totalPages <= 1) return null;
  const status = labels.pageStatus.replace("{current}", String(page)).replace("{total}", String(totalPages));

  return (
    <nav className={styles.pagination} aria-label={labels.paginationLabel}>
      {page > 1 ? <Link href={pageHref(basePath, page - 1)} className={styles.pageLink}>{labels.prevPage}</Link> : <span className={styles.pageLinkDisabled} aria-hidden="true">{labels.prevPage}</span>}
      <span className={styles.pageStatus}>{status}</span>
      {page < totalPages ? <Link href={pageHref(basePath, page + 1)} className={styles.pageLink}>{labels.nextPage}</Link> : <span className={styles.pageLinkDisabled} aria-hidden="true">{labels.nextPage}</span>}
    </nav>
  );
}
