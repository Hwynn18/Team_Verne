// styles/theme.css 의 색 토큰으로 글자/배경 조합의 대비를 검사한다 (WCAG 2.x 기준).
// 실패한 조합이 하나라도 있으면 종료 코드 1로 끝난다.
import { readFileSync } from "node:fs";

const THEME_PATH = "styles/theme.css";
const TEXT = 4.5; // 일반 글자 최소 대비

// [글자 토큰, 배경 토큰, 최소 대비, 설명]
// 새 조합을 CSS에 쓰면 여기에도 추가한다.
const PAIRS = [
  ["--color-text", "--color-bg", TEXT, "본문 글자"],
  ["--color-text-muted", "--color-bg", TEXT, "보조 글자 (날짜, 힌트)"],
  ["--color-primary-strong", "--color-bg", TEXT, "강조 글자, 링크"],
  ["--color-on-primary", "--color-primary", TEXT, "파란 배경 위 글자 (토글, 칩, 뱃지, 버튼)"],
  ["--color-on-primary", "--color-primary-hover", TEXT, "파란 버튼 hover 글자"],
  ["--color-text", "--color-surface", TEXT, "카드·패널 글자"],
  ["--color-text-muted", "--color-surface", TEXT, "카드·패널 보조 글자"],
  ["--color-primary-strong", "--color-surface", TEXT, "카드·패널 강조 글자 (역할, 소제목)"],
  ["--color-danger", "--color-surface", TEXT, "폼 패널 안 에러 글자"],
  ["--color-text", "--color-surface-2", TEXT, "hover 카드, 뱃지, 메뉴 글자"],
  ["--color-text-muted", "--color-surface-2", TEXT, "hover 카드 보조 글자"],
  ["--color-primary-strong", "--color-surface-2", TEXT, "메뉴 강조 글자"],
  ["--color-text", "--color-primary-soft", TEXT, "hover 배경 위 글자"],
  ["--color-primary-strong", "--color-primary-soft", TEXT, "활성 메뉴 글자, 성공 안내"],
  ["--color-danger", "--color-bg", TEXT, "에러 글자"],
  ["--color-danger", "--color-danger-soft", TEXT, "에러 안내 박스"],
  ["--color-on-danger", "--color-danger", TEXT, "삭제 버튼 글자"],
  ["--color-bg", "--color-text", TEXT, "반전 버튼 (남기기, 인스타그램에서 보기)"],
];

function readTokens(path) {
  const css = readFileSync(path, "utf8");
  const tokens = {};
  for (const [, name, value] of css.matchAll(/(--color-[\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[name] = value.trim();
  }
  return tokens;
}

function toRgb(hex, name) {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);
  if (!match) {
    throw new Error(`${name} must be a #hex color, got "${hex}"`);
  }
  const digits = match[1].length === 3 ? [...match[1]].map((d) => d + d).join("") : match[1];
  return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16) / 255);
}

function luminance([r, g, b]) {
  const [lr, lg, lb] = [r, g, b].map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function contrast(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

const tokens = readTokens(THEME_PATH);
let failed = 0;

for (const [fg, bg, min, label] of PAIRS) {
  if (!tokens[fg] || !tokens[bg]) {
    throw new Error(`Token not found in ${THEME_PATH}: ${!tokens[fg] ? fg : bg}`);
  }
  const ratio = contrast(toRgb(tokens[fg], fg), toRgb(tokens[bg], bg));
  const ok = ratio >= min;
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${ratio.toFixed(2)} (min ${min})  ${label}  [${fg} on ${bg}]`);
}

if (failed > 0) {
  console.error(`\n${failed} pair(s) below the minimum contrast.`);
  process.exit(1);
}
console.log("\nAll pairs pass.");
