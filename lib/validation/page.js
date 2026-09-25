const MAX_REASONABLE_PAGE = 100000; // 비정상적으로 큰 입력만 걸러내는 안전장치. 실제 상한은 totalPages로 별도 처리한다

export function parsePage(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > MAX_REASONABLE_PAGE) return 1;
  return n;
}
