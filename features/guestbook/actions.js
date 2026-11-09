"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hashPassword, verifyPassword } from "@/lib/security/password";
import { isHoneypotFilled, isCoolingDown, startCooldown, getClientIpHash, tryReserveSubmission } from "@/lib/forms/spamGuard";
import { parseEntryInput, parseDeleteInput } from "./validation";

const PAGE_PATH = "/guestbook";
const POST_SCOPE = "guestbook-post";
const POST_COOLDOWN_SECONDS = 10;
const IP_POST_LIMIT = { max: 3, windowSeconds: 600 };
const DELETE_SCOPE = "guestbook-delete";
const DELETE_COOLDOWN_SECONDS = 5;
const IP_DELETE_LIMIT = { max: 10, windowSeconds: 600 };
// 한 글에 시도가 이만큼 쌓이면 잠시 잠근다 (영구 잠금이면 아무나 남의 글을 못 지우게 만들 수 있음)
const MAX_DELETE_ATTEMPTS = 5;
const DELETE_LOCK_SECONDS = 900;

export async function createEntry(_prevState, formData) {
  // 봇에게 차단 사실을 알리지 않으려고 성공처럼 응답하고 저장하지 않는다
  if (isHoneypotFilled(formData)) return { status: "success" };

  const parsed = parseEntryInput(formData);
  if (await isCoolingDown(POST_SCOPE)) return { status: "error", code: "tooFast", values: parsed.values };
  if (!parsed.ok) return { status: "error", code: parsed.code, values: parsed.values };

  try {
    const ipHash = await getClientIpHash();
    if (!(await tryReserveSubmission(POST_SCOPE, ipHash, IP_POST_LIMIT))) {
      return { status: "error", code: "rateLimited", values: parsed.values };
    }
    const passwordHash = await hashPassword(parsed.password);
    const db = createSupabaseAdminClient();
    const { error } = await db.from("guestbook_entries").insert({ nickname: parsed.values.nickname, message: parsed.values.message, password_hash: passwordHash });
    if (error) throw new Error(`${error.code ?? "unknown"}: ${error.message}`);
  } catch (error) {
    console.error("[guestbook:create]", error);
    return { status: "error", code: "server", values: parsed.values };
  }

  await startCooldown(POST_SCOPE, POST_COOLDOWN_SECONDS);
  revalidatePath(PAGE_PATH);
  return { status: "success" };
}

export async function deleteEntry(_prevState, formData) {
  const parsed = parseDeleteInput(formData);
  if (!parsed.ok) return { status: "error", code: parsed.code };
  if (await isCoolingDown(DELETE_SCOPE)) return { status: "error", code: "tooFast" };

  try {
    // scrypt 전에 IP 제한을 먼저 걸어 비싼 해시 계산을 아무나 반복시키지 못하게 한다
    const ipHash = await getClientIpHash();
    if (!(await tryReserveSubmission(DELETE_SCOPE, ipHash, IP_DELETE_LIMIT))) return { status: "error", code: "deleteRateLimited" };

    // 시도 횟수를 확인 전에 원자적으로 올린다. 동시 요청도 한 글에 MAX_DELETE_ATTEMPTS번을 넘지 못한다.
    const db = createSupabaseAdminClient();
    const { data: attempt, error } = await db
      .rpc("guestbook_reserve_delete_attempt", { p_id: parsed.id, p_max: MAX_DELETE_ATTEMPTS, p_lock_seconds: DELETE_LOCK_SECONDS })
      .maybeSingle();
    if (error) throw new Error(`${error.code ?? "unknown"}: ${error.message}`);
    if (!attempt) throw new Error("guestbook_reserve_delete_attempt returned no row");
    if (attempt.status === "notFound") return { status: "error", code: "notFound" };
    if (attempt.status === "locked") return { status: "error", code: "locked" };
    if (attempt.status !== "allowed") throw new Error(`unexpected attempt status: ${attempt.status}`);

    const matches = await verifyPassword(parsed.password, attempt.password_hash);
    await startCooldown(DELETE_SCOPE, DELETE_COOLDOWN_SECONDS);
    if (!matches) return { status: "error", code: "wrongPassword" };

    const { error: deleteError } = await db.from("guestbook_entries").delete().eq("id", parsed.id);
    if (deleteError) throw new Error(`${deleteError.code ?? "unknown"}: ${deleteError.message}`);
  } catch (error) {
    console.error("[guestbook:delete]", error);
    return { status: "error", code: "server" };
  }

  revalidatePath(PAGE_PATH);
  return { status: "success" };
}
