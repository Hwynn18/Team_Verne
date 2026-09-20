const REQUIRED = ["SUPABASE_URL", "SUPABASE_ANON_KEY"];
const MIN_SECRET_LENGTH = 32;

export function getEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
  return {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  };
}

// 사이트 전체가 아니라 무효화 엔드포인트만 이 값에 의존하므로 getEnv와 분리했다
export function getRevalidateSecret() {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(`REVALIDATE_SECRET must be set and at least ${MIN_SECRET_LENGTH} characters`);
  }
  return secret;
}
