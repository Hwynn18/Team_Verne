import { getDictionary } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/localize";
import { getAllProjects } from "./projectQueries";
import { isValidSlug } from "@/lib/validation/slug";

// 탭 제목은 부가 정보라서 실패하거나 못 찾으면 기본 제목으로 두고 페이지 자체는 막지 않는다
export async function getProjectMetadata(slug) {
  if (!isValidSlug(slug)) return {};
  const [{ locale }, result] = await Promise.all([getDictionary(), getAllProjects()]);
  if (result.failed) return {};
  const project = result.data.find((item) => item.slug === slug);
  if (!project) return {};
  return { title: pickLocalized(project, "title", locale), description: pickLocalized(project, "summary", locale) };
}
