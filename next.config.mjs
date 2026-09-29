// features/projects/coverUrl.js, features/about/photoUrl.js, features/teams/galleryPhotoUrl.js 의 BUCKET 과 같은 값이어야 함
const IMAGE_BUCKETS = ["project-covers", "member-photos", "team-gallery"];
// npm run dev 기본 포트
const DEV_PORT = 3000;

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

// GitHub Codespaces 개발 환경에서만, 이 Codespace의 포워딩 주소를 Server Action 출처로 허용한다.
// production 빌드나 Codespaces 밖에서는 빈 목록이라 기본 동작(같은 출처만 허용)이 유지된다.
function getDevActionOrigins() {
  const name = process.env.CODESPACE_NAME;
  const domain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
  if (process.env.NODE_ENV === "production" || !name || !domain) return [];
  return [`${name}-${DEV_PORT}.${domain}`, `localhost:${DEV_PORT}`];
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
  experimental: {
    serverActions: {
      allowedOrigins: getDevActionOrigins(),
    },
  },
};

export default nextConfig;
