// DB check 제약과 같은 값이어야 함
export const NAME_MAX = 100;
export const EMAIL_MAX = 254;
export const MESSAGE_MAX = 3000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LINE_BREAK = /[\r\n]/;

function readText(formData, key) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function parseInquiryInput(formData) {
  const name = readText(formData, "name");
  const email = readText(formData, "email");
  const message = readText(formData, "message");
  const values = { name, email, message };

  if (!name || name.length > NAME_MAX || LINE_BREAK.test(name)) return { ok: false, code: "nameInvalid", values };
  if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) return { ok: false, code: "emailInvalid", values };
  if (!message || message.length > MESSAGE_MAX) return { ok: false, code: "messageInvalid", values };
  if (formData.get("consent") !== "on") return { ok: false, code: "consentRequired", values };
  return { ok: true, values };
}
