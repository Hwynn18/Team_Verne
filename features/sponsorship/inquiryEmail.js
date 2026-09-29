import "server-only";

const TIME_FORMAT = new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Seoul" });

// 알림 메일은 팀이 읽는 거라 한국어로 고정한다
export function buildInquiryEmail({ name, email, message }, createdAt) {
  const receivedAt = TIME_FORMAT.format(new Date(createdAt));
  const text = [
    "새 스폰서/제휴 문의가 접수됐어요.",
    "",
    `성함/단체명: ${name}`,
    `이메일: ${email}`,
    `접수 시각: ${receivedAt}`,
    "",
    "문의 내용:",
    message,
    "",
    "이 메일에 바로 답장하면 문의자에게 전달돼요.",
  ].join("\n");

  return { subject: `[스폰서 문의] ${name}`, text, replyTo: email };
}
