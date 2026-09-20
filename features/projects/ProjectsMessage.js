import styles from "./Projects.module.css";

export default function ProjectsMessage({ tone = "empty", children }) {
  const className = tone === "error" ? `${styles.message} ${styles.messageError}` : styles.message;
  return <p className={className}>{children}</p>;
}
