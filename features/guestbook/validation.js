// DB check 제약과 같은 값이어야 함
export const NICKNAME_MAX = 20;
export const PASSWORD_MIN = 4;
export const PASSWORD_MAX = 64;
export const MESSAGE_MAX = 500;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function readText(formData, key) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readPassword(formData) {
  const value = formData.get("password");
  return typeof value === "string" ? value : "";
}

function isValidPassword(password) {
  return password.length >= PASSWORD_MIN && password.length <= PASSWORD_MAX;
}

// values 에는 비밀번호를 넣지 않는다. 에러 시 폼에 되돌려 보내는 값이라서.
export function parseEntryInput(formData) {
  const nickname = readText(formData, "nickname");
  const message = readText(formData, "message");
  const password = readPassword(formData);
  const values = { nickname, message };

  if (!nickname || nickname.length > NICKNAME_MAX) return { ok: false, code: "nicknameInvalid", values };
  if (!isValidPassword(password)) return { ok: false, code: "passwordInvalid", values };
  if (!message || message.length > MESSAGE_MAX) return { ok: false, code: "messageInvalid", values };
  if (formData.get("consent") !== "on") return { ok: false, code: "consentRequired", values };
  return { ok: true, values, password };
}

export function parseDeleteInput(formData) {
  const id = formData.get("id");
  const password = readPassword(formData);
  if (typeof id !== "string" || !UUID.test(id)) return { ok: false, code: "deleteInvalid" };
  if (!isValidPassword(password)) return { ok: false, code: "wrongPassword" };
  return { ok: true, id, password };
}
