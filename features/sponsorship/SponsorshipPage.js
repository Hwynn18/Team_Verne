import { getDictionary } from "@/lib/i18n/server";
import InquiryForm from "./InquiryForm";
import styles from "./Sponsorship.module.css";

export default async function SponsorshipPage() {
  const { t } = await getDictionary();
  const labels = t.sponsorship;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{t.nav.sponsorship}</h1>
      <p className={styles.intro}>{labels.intro}</p>
      <InquiryForm labels={labels} />
    </main>
  );
}
