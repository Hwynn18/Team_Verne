import styles from "./Forms.module.css";

export default function PrivacyConsent({ labels }) {
  return (
    <fieldset className={styles.privacy}>
      <legend className={styles.privacyTitle}>{labels.title}</legend>
      <ul className={styles.privacyList}>
        <li>{labels.purpose}</li>
        <li>{labels.items}</li>
        <li>{labels.retention}</li>
      </ul>
      <p className={styles.privacyNote}>{labels.refusal}</p>
      <label className={styles.privacyAgree}>
        <input type="checkbox" name="consent" required />
        <span>{labels.agree}</span>
      </label>
    </fieldset>
  );
}
