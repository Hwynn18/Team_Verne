"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hashPassword, verifyPassword } from "@/lib/security/password";
import { isHoneypotFilled, isCoolingDown, startCooldown } from "@/lib/forms/spamGuard";
import { parseEntryInput, parseDeleteInput } from "./validation";

const PAGE_PATH = "/guestbook";
const POST_COOLDOWN_SECONDS = 30;
const DELETE_COOLDOWN_SECONDS = 5;
const MAX_DELETE_FAILURES = 5;

export async function createEntry(_prevState, formData) {
  // 봇에게 차단 사실을 알리지 않으려고 성공처럼 응답하고 저장하지 않는다
  if (isHoneypotFilled(formData)) return { status: "success" };

  const parsed = parseEntryInput(formData);
  if (await isCoolingDown("guestbook-post")) return { status: "error", code: "tooFast", values: parsed.values };
  if (!parsed.ok) return { status: "error", code: parsed.code, values: parsed.values };

  try {
    const passwordHash = await hashPassword(parsed.password);
    const db = createSupabaseAdminClient();
    const { error } = await db.from("guestbook_entries").insert({ nickname: parsed.values.nickname, message: parsed.values.message, password_hash: passwordHash });
    if (error) throw new Error(`${error.code ?? "unknown"}: ${error.message}`);
  } catch (error) {
    console.error("[guestbook:create]", error);
    return { status: "error", code: "server", values: parsed.values };
  }

  await startCooldown("guestbook-post", POST_COOLDOWN_SECONDS);
  revalidatePath(PAGE_PATH);
  return { status: "success" };
}

export async function deleteEntry(_prevState, formData) {
  const parsed = parseDeleteInput(formData);
  if (!parsed.ok) return { status: "error", code: parsed.code };
  if (await isCoolingDown("guestbook-delete")) return { status: "error", code: "tooFast" };

  try {
    const db = createSupabaseAdminClient();
    const { data: row, error } = await db.from("guestbook_entries").select("id, password_hash, delete_failures").eq("id", parsed.id).maybeSingle();
    if (error) throw new Error(`${error.code ?? "unknown"}: ${error.message}`);
    if (!row) return { status: "error", code: "notFound" };
    // 비밀번호 무차별 대입을 막으려고 실패 횟수를 DB에 남긴다 (쿠키를 지워도 우회 불가)
    if (row.delete_failures >= MAX_DELETE_FAILURES) return { status: "error", code: "locked" };

    const matches = await verifyPassword(parsed.password, row.password_hash);
    await startCooldown("guestbook-delete", DELETE_COOLDOWN_SECONDS);

    if (!matches) {
      const { error: updateError } = await db.from("guestbook_entries").update({ delete_failures: row.delete_failures + 1 }).eq("id", row.id);
      if (updateError) throw new Error(`${updateError.code ?? "unknown"}: ${updateError.message}`);
      return { status: "error", code: "wrongPassword" };
    }

    const { error: deleteError } = await db.from("guestbook_entries").delete().eq("id", row.id);
    if (deleteError) throw new Error(`${deleteError.code ?? "unknown"}: ${deleteError.message}`);
  } catch (error) {
    console.error("[guestbook:delete]", error);
    return { status: "error", code: "server" };
  }

  revalidatePath(PAGE_PATH);
  return { status: "success" };
}
