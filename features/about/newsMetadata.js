import { getDictionary } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/localize";
import { isValidSlug } from "@/lib/validation/slug";
import { getNewsBySlug } from "./aboutQueries";

// 탭 제목은 부가 정보라서 실패하거나 못 찾으면 기본 제목으로 두고 페이지 자체는 막지 않는다
export async function getNewsMetadata(slug) {
  if (!isValidSlug(slug)) return {};
  const [{ locale }, result] = await Promise.all([getDictionary(), getNewsBySlug(slug)]);
  if (result.failed || !result.data) return {};
  return { title: pickLocalized(result.data, "title", locale) };
}
