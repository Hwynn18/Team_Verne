// git에 올라간 파일 중 대소문자만 다른 경로가 있는지 검사한다.
// 윈도우/맥은 대소문자를 구분하지 않아 두 파일이 하나로 덮이므로, 디스크가 아니라 git 인덱스를 기준으로 본다.
// 충돌이 하나라도 있으면 종료 코드 1로 끝난다.
import { execFileSync } from "node:child_process";

function listTrackedPaths() {
  const output = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" });
  return output.split("\0").filter(Boolean);
}

// 폴더 이름끼리 부딪히는 경우도 잡으려고 상위 폴더 경로까지 모두 포함한다
function withParentDirs(paths) {
  const all = new Set();
  for (const path of paths) {
    const parts = path.split("/");
    for (let i = 1; i <= parts.length; i++) all.add(parts.slice(0, i).join("/"));
  }
  return [...all];
}

function findCollisions(paths) {
  const groups = new Map();
  for (const path of paths) {
    const key = path.toLowerCase();
    groups.set(key, [...(groups.get(key) ?? []), path]);
  }
  return [...groups.values()].filter((group) => group.length > 1);
}

const collisions = findCollisions(withParentDirs(listTrackedPaths()));

if (collisions.length === 0) {
  console.log("OK: 대소문자만 다른 경로 없음");
} else {
  for (const group of collisions) console.error(`FAIL: ${group.join("  <->  ")}`);
  process.exit(1);
}
