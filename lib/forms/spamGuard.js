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

export async function isIpRateLimited(scope, ipHash, { max, windowSeconds }) {
  const db = createSupabaseAdminClient();
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();
  const { count, error } = await db.from("submission_log").select("id", { count: "exact", head: true }).eq("scope", scope).eq("ip_hash", ipHash).gte("created_at", since);
  if (error) throw new Error(`${error.code ?? "unknown"}: ${error.message}`);
  return (count ?? 0) >= max;
}

// 제출을 기록하고, 보관 기간이 지난 기록을 같이 지운다
export async function recordSubmission(scope, ipHash) {
  const db = createSupabaseAdminClient();
  const { error } = await db.from("submission_log").insert({ scope, ip_hash: ipHash });
  if (error) throw new Error(`${error.code ?? "unknown"}: ${error.message}`);
  const expired = new Date(Date.now() - LOG_RETENTION_HOURS * 3600 * 1000).toISOString();
  const { error: cleanupError } = await db.from("submission_log").delete().lt("created_at", expired);
  if (cleanupError) throw new Error(`${cleanupError.code ?? "unknown"}: ${cleanupError.message}`);
}
