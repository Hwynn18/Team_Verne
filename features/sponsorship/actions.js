"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendNotificationEmail } from "@/lib/email/sendNotificationEmail";
import { isHoneypotFilled, isCoolingDown, startCooldown, getClientIpHash, isIpRateLimited, recordSubmission } from "@/lib/forms/spamGuard";
import { parseInquiryInput } from "./validation";
import { buildInquiryEmail } from "./inquiryEmail";

const SCOPE = "sponsorship";
const COOLDOWN_SECONDS = 60;
const IP_LIMIT = { max: 3, windowSeconds: 3600 };

export async function submitInquiry(_prevState, formData) {
  // 봇에게 차단 사실을 알리지 않으려고 성공처럼 응답하고 저장하지 않는다
  if (isHoneypotFilled(formData)) return { status: "success" };

  const parsed = parseInquiryInput(formData);
  if (await isCoolingDown(SCOPE)) return { status: "error", code: "tooFast", values: parsed.values };
  if (!parsed.ok) return { status: "error", code: parsed.code, values: parsed.values };

  let createdAt;
  try {
    const ipHash = await getClientIpHash();
    if (await isIpRateLimited(SCOPE, ipHash, IP_LIMIT)) {
      return { status: "error", code: "rateLimited", values: parsed.values };
    }
    const db = createSupabaseAdminClient();
    const { data, error } = await db.from("sponsorship_inquiries").insert(parsed.values).select("created_at").single();
    if (error) throw new Error(`${error.code ?? "unknown"}: ${error.message}`);
    createdAt = data.created_at;
    await recordSubmission(SCOPE, ipHash);
  } catch (error) {
    console.error("[sponsorship:save]", error);
    return { status: "error", code: "server", values: parsed.values };
  }

  // 문의는 이미 DB에 저장됐다. 알림 실패는 로그로 남기고 사용자에게는 접수 성공으로 보여준다.
  try {
    await sendNotificationEmail(buildInquiryEmail(parsed.values, createdAt));
  } catch (error) {
    console.error("[sponsorship:notify] inquiry saved but email failed", error);
  }

  await startCooldown(SCOPE, COOLDOWN_SECONDS);
  return { status: "success" };
}
