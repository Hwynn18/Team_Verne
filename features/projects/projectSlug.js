// DB의 slug check 제약과 같은 규칙
const SLUG_PATTERN = /^[a-z0-9-]+$/;

export function isValidSlug(value) {
  return typeof value === "string" && SLUG_PATTERN.test(value);
}
