// features/projects/coverUrl.js, features/about/photoUrl.js 의 BUCKET 과 같은 값이어야 함
const IMAGE_BUCKETS = ["project-covers", "member-photos", "team-gallery"];

// 이미지 최적화를 허용할 Supabase 호스트를 .env.local 의 SUPABASE_URL 에서 가져온다
function getSupabaseHost() {
  const raw = process.env.SUPABASE_URL;
  if (!raw) {
    throw new Error("SUPABASE_URL is required in next.config.mjs (image host allowlist)");
  }
  const url = new URL(raw);
  if (url.protocol !== "https:") {
    throw new Error(`SUPABASE_URL must use https: ${raw}`);
  }
  return url.hostname;
}

const host = getSupabaseHost();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: IMAGE_BUCKETS.map((bucket) => ({
      protocol: "https",
      hostname: host,
      pathname: `/storage/v1/object/public/${bucket}/**`,
    })),
  },
};

export default nextConfig;
