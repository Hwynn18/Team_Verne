import Link from "next/link";
import { getDictionary } from "@/lib/i18n/server";
import styles from "./NotFound.module.css";

export default async function NotFoundPage() {
  const { t } = await getDictionary();
  const labels = t.notFound;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{labels.title}</h1>
      <p className={styles.desc}>{labels.description}</p>
      <Link href="/" className={styles.homeLink}>{labels.homeLink} →</Link>
    </main>
  );
}
