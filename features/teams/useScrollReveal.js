"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

// 화면에 한 번 들어오면 계속 보인 상태로 둔다(once: true). 스크롤할 때마다 깜빡이지 않게 하려는 거야.
// reduceMotion은 호출하는 쪽에서 initial={false}로 넘겨 마운트 애니메이션 자체를 생략하는 데 쓴다.
export function useScrollReveal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduceMotion = useReducedMotion();
  return { ref, visible: reduceMotion || inView, reduceMotion };
}
