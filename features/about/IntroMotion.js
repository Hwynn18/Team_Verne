"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useImageFailed } from "@/lib/hooks/useImageFailed";
import { useScrollReveal } from "@/features/teams/useScrollReveal";
import styles from "./About.module.css";

// 화면에 들어오면 아래에서 살짝 떠오른다. 모션 줄이기 설정이면 처음부터 보인 상태.
export function Reveal({ as = "div", className, children }) {
  const { ref, visible, reduceMotion } = useScrollReveal();
  const Tag = motion[as];
  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </Tag>
  );
}

// 스크롤에 따라 사진이 액자 안에서 천천히 움직인다. 파일이 아직 없으면 회색 자리만 보인다.
export function ParallaxPhoto({ src, sizes }) {
  const frameRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { failed, imageRef, handleError } = useImageFailed(src);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={frameRef} className={styles.introPhoto} aria-hidden="true">
      {!failed && (
        <motion.div className={styles.introPhotoInner} style={reduceMotion ? undefined : { y }}>
          {/* 팀 분위기용 장식 사진이라 alt를 비운다. 내용은 옆의 글이 전달한다. */}
          <Image ref={imageRef} src={src} alt="" fill sizes={sizes} className={styles.introPhotoImage} onError={handleError} />
        </motion.div>
      )}
    </div>
  );
}
