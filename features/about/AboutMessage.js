import styles from "./About.module.css";

export default function AboutMessage({ tone = "empty", children }) {
  const className = tone === "error" ? `${styles.message} ${styles.messageError}` : styles.message;
  return <p className={className}>{children}</p>;
}
