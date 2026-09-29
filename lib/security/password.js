import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;
const HEX = /^[0-9a-f]+$/;

// 저장 형식: "salt(hex):hash(hex)"
export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, KEY_LENGTH);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

export async function verifyPassword(password, stored) {
  const [saltHex, keyHex] = typeof stored === "string" ? stored.split(":") : [];
  if (!saltHex || !keyHex || !HEX.test(saltHex) || !HEX.test(keyHex)) {
    console.error("[password] malformed hash");
    return false;
  }
  const expected = Buffer.from(keyHex, "hex");
  const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
