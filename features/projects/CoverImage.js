"use client";

import Image from "next/image";
import { useImageFailed } from "@/lib/hooks/useImageFailed";
import styles from "./Cover.module.css";

export default function CoverImage({ src, sizes, eager = false }) {
  const { failed, imageRef, handleError } = useImageFailed(src);

  if (!src || failed) {
    return <div className={`${styles.frame} ${styles.placeholder}`} aria-hidden="true" />;
  }

  return (
    <div className={styles.frame}>
      <Image ref={imageRef} src={src} alt="" fill sizes={sizes} loading={eager ? "eager" : "lazy"} className={styles.image} onError={handleError} />
    </div>
  );
}
