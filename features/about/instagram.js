const HOSTS = ["instagram.com", "www.instagram.com"];
const HANDLE_PATTERN = /^[A-Za-z0-9._]{1,30}$/;
// 프로필이 아닌 경로(게시물, 탐색 등)는 계정 이름으로 취급하지 않는다
const RESERVED = new Set(["p", "reel", "reels", "explore", "accounts", "stories", "tv", "direct"]);

// 계정 프로필 주소에서 계정 이름을 꺼낸다. 형식이 맞지 않으면 null.
export function getInstagramHandle(profileUrl) {
  let url;
  try {
    url = new URL(profileUrl);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !HOSTS.includes(url.hostname)) return null;
  const [first] = url.pathname.split("/").filter(Boolean);
  if (!first || RESERVED.has(first.toLowerCase()) || !HANDLE_PATTERN.test(first)) return null;
  return first;
}
