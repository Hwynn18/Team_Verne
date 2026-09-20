import "server-only";
import { getEnv } from "@/lib/config/env";

// SQL의 버킷 이름, next.config.mjs 의 pathname 과 같은 값이어야 함
const BUCKET = "project-covers";
// DB check 제약과 같은 규칙: 폴더 없이 파일명만, 허용 확장자만
const FILE_NAME = /^[a-z0-9_-]+(\.[a-z0-9_-]+)*\.(jpg|jpeg|png|webp)$/;

export function getCoverUrl(coverPath) {
  if (coverPath == null) return null;
  if (typeof coverPath !== "string" || !FILE_NAME.test(coverPath)) {
    console.error("[coverUrl] invalid cover_path:", coverPath);
    return null;
  }
  const { supabaseUrl } = getEnv();
  return new URL(`/storage/v1/object/public/${BUCKET}/${encodeURIComponent(coverPath)}`, supabaseUrl).toString();
}
