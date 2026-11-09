import "server-only";
import { createHmac } from "node:crypto";
import { cookies, headers } from "next/headers";
import { getIpHashSecret } from "@/lib/config/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { HONEYPOT_FIELD } from "./honeypot";

const LOG_RETENTION_HOURS = 24;

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

// 접속 IP를 원본 대신 HMAC 해시로 돌려준다. IP를 알 수 없으면 제한을 적용할 수 없으니 실패시킨다.
// x-forwarded-for 는 앞단 프록시가 채워주는 값이라, 배포 호스팅에서 신뢰할 수 있는지 배포 때 다시 확인해야 한다.
export async function getClientIpHash() {
  const store = await headers();
  const ip = store.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) {
    throw new Error("[spamGuard] client IP unavailable");
  }
  return createHmac("sha256", getIpHashSecret()).update(ip).digest("hex");
}

// 제한 안이면 이번 제출 자리를 기록하고 true, 넘었으면 기록 없이 false.
// 확인과 기록을 DB 함수 하나에서 잠금으로 묶어 동시 요청도 max를 넘지 못한다. 부작용(저장·메일)보다 먼저 호출한다.
export async function tryReserveSubmission(scope, ipHash, { max, windowSeconds }) {
  const db = createSupabaseAdminClient();
  const { data, error } = await db.rpc("submission_try_reserve", {
    p_scope: scope,
    p_ip_hash: ipHash,
    p_max: max,
    p_window_seconds: windowSeconds,
    p_retention_seconds: LOG_RETENTION_HOURS * 3600,
  });
  if (error) throw new Error(`${error.code ?? "unknown"}: ${error.message}`);
  if (typeof data !== "boolean") throw new Error(`submission_try_reserve returned ${typeof data}`);
  return data;
}
