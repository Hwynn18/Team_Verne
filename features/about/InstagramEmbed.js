import styles from "./About.module.css";

export default function InstagramEmbed({ handle, title }) {
  const src = `https://www.instagram.com/${encodeURIComponent(handle)}/embed/`;
  return (
    <iframe
      className={styles.embed}
      src={src}
      title={title}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    />
  );
}
