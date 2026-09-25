// 연혁은 "년.월"까지만 보여준다. 정확한 일자를 노출하지 않기로 한 선택이다.
export function formatEventDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}.${month}`;
}
