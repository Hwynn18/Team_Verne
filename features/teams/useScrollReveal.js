"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

// 기본은 화면에 한 번 들어오면 계속 보인 상태(once: true). once: false면 벗어날 때 숨었다가 다시 들어오면 또 나온다.
// reduceMotion은 호출하는 쪽에서 initial={false}로 넘겨 마운트 애니메이션 자체를 생략하는 데 쓴다.
export function useScrollReveal({ once = true } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-15% 0px" });
  const reduceMotion = useReducedMotion();
  return { ref, visible: reduceMotion || inView, reduceMotion };
}
