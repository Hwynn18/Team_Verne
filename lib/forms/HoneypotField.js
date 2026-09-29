import { HONEYPOT_FIELD } from "./honeypot";
import styles from "./Forms.module.css";

export default function HoneypotField() {
  return (
    <div className={styles.honeypot} aria-hidden="true">
      <label>
        Website
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
