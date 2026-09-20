"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Cover.module.css";

export default function CoverImage({ src, sizes, eager = false }) {
  const [failed, setFailed] = useState(false);
  const imageRef = useRef(null);

  // 하이드레이션 전에 이미 로딩이 실패했으면 onError를 놓치므로 한 번 더 확인한다
  useEffect(() => {
    const image = imageRef.current;
    if (image && image.complete && image.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (!src || failed) {
    return <div className={`${styles.frame} ${styles.placeholder}`} aria-hidden="true" />;
  }

  return (
    <div className={styles.frame}>
      <Image ref={imageRef} src={src} alt="" fill sizes={sizes} loading={eager ? "eager" : "lazy"} className={styles.image} onError={() => setFailed(true)} />
    </div>
  );
}
