import "server-only";
import { getEmailEnv } from "@/lib/config/env";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
// 도메인 인증 전에는 이 주소에서, Resend 가입 이메일로만 보낼 수 있다
const FROM = "Team Website <onboarding@resend.dev>";
const TIMEOUT_MS = 10000;

// 제목·답장 주소에 줄바꿈이 섞이면 메일 헤더가 깨질 수 있어서 한 줄로 만든다
function singleLine(value) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

// 팀에게 알림 메일을 보낸다. 본문은 순수 텍스트만 쓴다(HTML 해석 없음).
export async function sendNotificationEmail({ subject, text, replyTo }) {
  const { apiKey, notifyTo } = getEmailEnv();
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [notifyTo], subject: singleLine(subject), text, reply_to: singleLine(replyTo) }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend ${response.status}: ${body.slice(0, 300)}`);
  }
}
