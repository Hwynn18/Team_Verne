"use client";

import Image from "next/image";
import { useImageFailed } from "@/lib/hooks/useImageFailed";
import styles from "./About.module.css";

export default function MemberAvatar({ src, initial }) {
  const { failed, imageRef, handleError } = useImageFailed(src);

  if (!src || failed) {
    return <div className={styles.avatar} aria-hidden="true">{initial}</div>;
  }

  return (
    <div className={styles.avatar}>
      <Image ref={imageRef} src={src} alt="" fill sizes="80px" className={styles.avatarImage} onError={handleError} />
    </div>
  );
}
