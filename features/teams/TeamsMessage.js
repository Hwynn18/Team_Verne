import styles from "./Teams.module.css";

export default function TeamsMessage({ tone = "empty", children }) {
  const className = tone === "error" ? `${styles.message} ${styles.messageError}` : styles.message;
  return <p className={className}>{children}</p>;
}
