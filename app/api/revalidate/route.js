import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/lib/cache/cachedQuery";
import { getRevalidateSecret } from "@/lib/config/env";

function digest(value) {
  return createHash("sha256").update(value).digest();
}

// 길이가 달라도 같은 길이의 해시끼리 비교해서 timingSafeEqual이 던지지 않게 한다
function isAuthorized(request, secret) {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return timingSafeEqual(digest(token), digest(secret));
}

// POST만 내보내서 GET 등 다른 메서드는 Next가 405로 막는다
export async function POST(request) {
  let secret;
  try {
    secret = getRevalidateSecret();
  } catch (error) {
    console.error("[revalidate]", error);
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  if (!isAuthorized(request, secret)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    // 태그는 서버가 고정한다. 호출하는 쪽이 임의의 태그를 지정할 수 없다.
    revalidateTag(CACHE_TAG, { expire: 0 });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[revalidate]", error);
    return Response.json({ ok: false, error: "revalidate_failed" }, { status: 500 });
  }
}
