import "server-only";
import { getPublicImageUrl } from "@/lib/storage/publicImage";

// SQL의 버킷 이름, next.config.mjs 의 IMAGE_BUCKETS 와 같은 값이어야 함
const BUCKET = "team-gallery";

export function getGalleryPhotoUrl(photoPath) {
  return getPublicImageUrl(BUCKET, photoPath);
}
