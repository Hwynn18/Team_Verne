"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

// 화면에 한 번 들어오면 계속 보인 상태로 둔다(once: true). 스크롤할 때마다 깜빡이지 않게 하려는 거야.
// 시스템 설정에서 모션 최소화를 켠 사용자에게는 애니메이션을 아예 적용하지 않는다.
export function useScrollReveal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduceMotion = useReducedMotion();
  console.log("[useScrollReveal] reduceMotion:", reduceMotion);
  return { ref, visible: reduceMotion || inView };
}
