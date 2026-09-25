import "server-only";
import { unstable_cache } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const CACHE_SECONDS = 60;
// 모든 조회가 같은 태그를 공유한다. revalidateTag(CACHE_TAG) 한 번으로 전부 무효화된다.
export const CACHE_TAG = "supabase-data";
const usedLabels = new Set();

function reserveLabel(label) {
  if (usedLabels.has(label)) {
    throw new Error(`Duplicate cache label: ${label}`);
  }
  usedLabels.add(label);
}

// label이 캐시 키다. 로케일이 아니라 쿼리 기준이라 ko/en이 같은 캐시를 쓴다.
// 실패는 throw로 캐시 바깥에 내보낸다. 성공한 값만 저장되고 실패는 저장되지 않는다.
export function createCachedQuery(label, buildQuery) {
  reserveLabel(label);
  const load = unstable_cache(
    async () => {
      const supabase = createSupabaseServerClient();
      const { data, error } = await buildQuery(supabase);
      if (error) throw new Error(`${error.code ?? "unknown"}: ${error.message}`);
      return data;
    },
    ["supabase-query", label],
    { revalidate: CACHE_SECONDS, tags: [CACHE_TAG] }
  );

  return async function query() {
    try {
      return { data: await load(), failed: false };
    } catch (error) {
      console.error(`[query:${label}]`, error);
      return { data: [], failed: true };
    }
  };
}

// 인자(페이지 번호, slug 등)에 따라 캐시가 나뉘는 조회용. fn의 인자가 캐시 키에 그대로 들어간다.
export function createCachedFn(label, fn) {
  reserveLabel(label);
  const load = unstable_cache(fn, ["supabase-fn", label], { revalidate: CACHE_SECONDS, tags: [CACHE_TAG] });

  return async function query(...args) {
    try {
      return { data: await load(...args), failed: false };
    } catch (error) {
      console.error(`[query:${label}]`, error, ...args);
      return { data: null, failed: true };
    }
  };
}
