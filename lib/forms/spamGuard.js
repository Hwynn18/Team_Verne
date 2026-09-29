import "server-only";
import { cookies } from "next/headers";
import { HONEYPOT_FIELD } from "./honeypot";

export function isHoneypotFilled(formData) {
  const value = formData.get(HONEYPOT_FIELD);
  return typeof value === "string" && value.length > 0;
}

function cookieName(scope) {
  return `cooldown_${scope}`;
}

// 같은 브라우저의 연속 제출을 막는다. 쿠키가 살아 있는 동안은 대기 상태다.
export async function isCoolingDown(scope) {
  const store = await cookies();
  return store.has(cookieName(scope));
}

export async function startCooldown(scope, seconds) {
  const store = await cookies();
  store.set(cookieName(scope), "1", {
    maxAge: seconds,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}
