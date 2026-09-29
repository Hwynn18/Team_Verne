import styles from "./Forms.module.css";

// labels.processor 는 선택 항목. 외부 서비스로 개인정보가 전달될 때만 넣는다.
export default function PrivacyConsent({ labels }) {
  return (
    <fieldset className={styles.privacy}>
      <legend className={styles.privacyTitle}>{labels.title}</legend>
      <ul className={styles.privacyList}>
        <li>{labels.purpose}</li>
        <li>{labels.items}</li>
        <li>{labels.retention}</li>
        {labels.processor && <li>{labels.processor}</li>}
      </ul>
      <p className={styles.privacyNote}>{labels.refusal}</p>
      <label className={styles.privacyAgree}>
        <input type="checkbox" name="consent" required />
        <span>{labels.agree}</span>
      </label>
    </fieldset>
  );
}
