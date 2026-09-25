import "server-only";
import { getEnv } from "@/lib/config/env";

// DB의 cover_path / photo_path check 제약과 같은 규칙: 폴더 없이 파일명만, 허용 확장자만
const FILE_NAME = /^[a-z0-9_-]+(\.[a-z0-9_-]+)*\.(jpg|jpeg|png|webp)$/;
// 본문(마크다운)에서 이미지 삽입을 허용할 버킷. project-covers/member-photos는 코드가 직접 주소를 만들어서 여기 포함하지 않는다.
const ALLOWED_BODY_IMAGE_BUCKETS = ["news-images"];
const STORAGE_PATH = /^\/storage\/v1\/object\/public\/([a-z0-9-]+)\/[a-z0-9_-]+(\.[a-z0-9_-]+)*\.(jpg|jpeg|png|webp)$/;

export function getPublicImageUrl(bucket, fileName) {
  if (fileName == null) return null;
  if (typeof fileName !== "string" || !FILE_NAME.test(fileName)) {
    console.error(`[publicImage:${bucket}] invalid file name:`, fileName);
    return null;
  }
  const { supabaseUrl } = getEnv();
  return new URL(`/storage/v1/object/public/${bucket}/${encodeURIComponent(fileName)}`, supabaseUrl).toString();
}

// 마크다운 본문 안의 이미지 주소가 우리 스토리지의 허용된 버킷을 가리키는지 검증한다
export function isAllowedBodyImageUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  const { supabaseUrl } = getEnv();
  let host;
  try {
    host = new URL(supabaseUrl).hostname;
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:" || parsed.hostname !== host) return false;
  const match = parsed.pathname.match(STORAGE_PATH);
  return Boolean(match) && ALLOWED_BODY_IMAGE_BUCKETS.includes(match[1]);
}
