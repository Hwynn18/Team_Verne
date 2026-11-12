# Team WV 웹사이트 — 작업 맥락

이 문서는 claude.ai 대화에서 진행한 작업을 Claude Code가 이어받기 위한 맥락이다.
새 작업을 시작하기 전에 끝까지 읽는다.

## 1. 대화·작업 규칙 (사용자 요청, 반드시 지킴)

- 답변은 한국어, 친구 같은 반말. AI처럼 딱딱하거나 과하게 다듬은 말투 금지.
- 설명은 짧게, 실제 동작하는 완전한 코드 중심.
- 코드를 쓴 뒤에는 항상 **예외 처리**와 **보안** 검토를 붙인다.
- 기능 코드는 기능별로 분리한다(아래 구조 참고). 함수 하나는 책임 하나.
- 형사처럼 디버깅한다: 추측보다 증거. 재현 안 되는 버그는 아직 없는 것. 코드 쓰기 전에 가설을 세우고,
  로그·출력으로 원인을 하나로 좁힌 뒤에만 고친다. 증거 없이 멀쩡한 코드를 고치지 않는다.
- 단순하게. 대체 경로·백업 로직 없이 한 가지 올바른 방법. 사전 조건이 안 맞으면 빠르게 실패.
- 외과적 수정: 필요한 곳만 최소로 바꾼다. 증상이 아니라 근본 원인을 고친다.
- **지시받지 않은 기능은 먼저 만들지 않는다.** 지시한 작업을 끝낸 뒤 "제안 (아직 안 만들었어)"으로
  영향과 과정(수정 파일 수 포함)을 설명하고 사용자가 고르게 한다.
- 확실하지 않은 사실(라이브러리 API, 외부 서비스 화면 이름 등)은 확인했다고 말하지 않는다.
  문서로 확인하거나 "확인 못 함"이라고 밝힌다.
- 커밋 전 체크리스트(아래 5절)를 사용자에게 안내한다.

## 2. 프로젝트 개요

- 팀 이름: **Team WV** (예전 표기 Team Verne는 폐기). 인스타그램: teamwv_05
- 기획서: 프로젝트 파일 MyTeam.docx 기준. 메뉴: Home / About(팀 소개·파트별 멤버·소셜·소식) /
  Teams(팀 분위기·팀 역사·파트) / Projects / 팀 응원 방명록 / 스폰서십 & 스폰서 문의
- 좌측 사이드바 내비. 상위 메뉴(About, Teams)는 hover/탭 시 하위 메뉴만 열고 페이지 이동 없음.
- KO/EN 전환: 쿠키 `locale`, 사전은 `lib/i18n/dictionaries/{ko,en}.js`

## 3. 디자인

- 다크 테마. 색은 전부 `styles/theme.css` 토큰으로만 쓴다(CSS에 색 직접 적지 않기).
  - `--color-primary #0233fb` 로고 파랑: 면(버튼·칩·뱃지·배너)에만. 그 위 글자는 `--color-on-primary`(흰색)
  - `--color-primary-strong #7c96ff`: 강조 글자·링크·포커스 링 (로고 파랑은 검은 배경에서 대비 2.87이라 글자로 쓰지 않음)
  - `--color-primary-soft #0f1f5c`: hover·활성 메뉴 배경
  - 보조 글자 `--color-text-muted`, 에러 `--color-danger`
- 새 글자/배경 조합을 만들면 `scripts/check-contrast.mjs`의 PAIRS에 추가하고 `npm run check:contrast` 통과 확인.
- 로고: `public/logo.svg`(파랑, 사이드바에 사용), `public/logo-black.svg`. 원본 비율 960×300.
  파비콘: `app/icon.svg`(파란 사각형 + 흰 로고). 로고 교체는 `lib/config/site.js`만 수정.
- 폰트: Pretendard 가변 폰트, 동적 서브셋(`lib/config/fonts.js` 한 파일에서 교체).
  굵기 가이드: 메인 타이틀/메뉴 Bold(700), 서브 타이틀 SemiBold(600), 본문 Regular(400), 부가 정보 Regular/Light.

## 4. 코드 구조와 규칙

app/ 라우트만 얇게. 실제 화면은 features/에서 가져온다
features/<기능>/ 기능별 코드 (layout, home, about, teams, projects, guestbook, sponsorship)


- DB 읽기: 공개 데이터는 `createCachedQuery`/`createCachedFn` + anon 클라이언트. 실패는 `{ failed: true }`로 섹션만 안내 문구.
- DB 쓰기: 반드시 Server Action(`"use server"`)에서 검증 후 `createSupabaseAdminClient()`. 브라우저에서 직접 쓰기 금지.
- 다국어 컬럼은 `<field>_ko`, `<field>_en`. 사전에 없는 키·컬럼은 렌더링 때 에러(오타를 바로 잡기 위해 의도적).
- 캐시 즉시 무효화: `POST /api/revalidate` + `Authorization: Bearer $REVALIDATE_SECRET`.
- 이미지: Supabase Storage 공개 버킷, DB에는 파일명만. 허용 버킷은 `next.config.mjs`의 IMAGE_BUCKETS와 각 URL 함수에 같이 등록.
- Server Action 출처 허용(allowedOrigins)은 Codespaces에서만 켜지고 로컬/배포에서는 비어 있음.

## 5. Supabase (기본 스키마는 SQL Editor에서 직접 만들었고 저장소에 없음. 2026-11-09 이후 추가분은 `docs/sql/`)

모든 테이블 RLS 켜짐. anon은 공개 테이블 SELECT만, 쓰기 권한 회수.
- 공개 읽기: `projects`, `news`(published_at <= now()만), `departments`, `project_departments`, `members`,
  `history_events`, `gallery_photos`
- anon 접근 완전 차단(관리자 키로만): `guestbook_entries`(password_hash는 scrypt), `sponsorship_inquiries`,
  `submission_log`(IP는 HMAC 해시, 24시간 보관)
- 공개 버킷: `project-covers`, `member-photos`, `news-images`, `team-gallery` (jpg/png/webp, 2MB, 쓰기 정책 없음)
- 주요 CHECK: slug `^[a-z0-9-]+$`, 이미지 파일명 규칙, 글자 수 제한. 코드 검증 상수와 값을 맞춘다.
- `docs/sql/` (번호 순서대로 SQL Editor에서 실행, 새 환경 만들 때 다시 실행):
  - `001` `guestbook_reserve_delete_attempt` RPC + `guestbook_entries.delete_locked_until` (삭제 시도 원자 예약, 5회 → 15분 잠금)
  - `002` `submission_try_reserve` RPC + 인덱스 (IP 제한 확인·기록 원자화, 부작용 전에 호출)
  - `003` pg_cron: submission_log 24시간 정리(매시), cron.job_run_details 7일 정리
  - RPC는 둘 다 anon/authenticated 실행 권한 회수, service_role만. 코드가 이 함수에 의존하므로 SQL 먼저, 배포 나중.

## 6. 환경변수 (.env.local, 절대 커밋 금지 · 채팅에 붙이지 않기)

SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, REVALIDATE_SECRET, IP_HASH_SECRET,
RESEND_API_KEY, INQUIRY_NOTIFY_EMAIL(Resend 가입 이메일과 같아야 함. 도메인 인증 전엔 그 주소로만 발송 가능)

## 7. 커밋 전 체크리스트

```bash
npm run lint
npm run build
npm run check:contrast
npm run check:case
for VAR in SUPABASE_SERVICE_ROLE_KEY RESEND_API_KEY; do
  P=$(grep "^$VAR=" .env.local | cut -d= -f2- | cut -c1-24)
  if [ -z "$P" ]; then echo "SKIP: $VAR 없음"; elif grep -rlq "$P" .next/static; then echo "LEAK: $VAR 커밋 금지"; else echo "OK: $VAR"; fi
done
git add .
git diff --cached --name-only | grep -E '(^|/)(\.env\.local|node_modules)' || echo "OK: 민감 파일 없음"
```
lint 경고 `@next/next/no-img-element`(소식 본문·갤러리 이미지)는 알고 있는 사항, 나중에 정리.

## 8. 진행 상황

완료: 레이아웃/다국어/모바일 메뉴, Home, About, Teams(모션은 motion 라이브러리, reduced-motion 대응),
Projects(파트 필터·상세), 방명록(허니팟·쿨다운·IP 제한·삭제 잠금·페이지네이션), 스폰서 문의(Resend 알림),
브랜딩(로고·다크 테마·Pretendard·팀 소개 문구).

실제 내용 입력 (2026-10-14):
- 멤버: 이휘성(기획·개발 파트 리더, lee.jpg), 윤태중(기획·디자인, yoon.jpg), 개발 1자리는 `공석`/`Vacant`.
  Teams 파트 페이지도 같은 members 테이블을 읽어서 같이 바뀜.
- 소식: 샘플 15개와 sample-news.jpg 삭제. "이휘성 전역 D-19"(team, 전역일 2026-11-02) 1개만 있음. D-19는 고정 글자.
- 팀 역사: 사용자가 이미 채움.
- 샘플 정리 (2026-11-12): sample-* 프로젝트 4개(+project_departments, project-covers의 sample-active.jpg, missing.jpg 값),
  방명록 테스트 글 2개, member-photos의 sample-member-a.jpg 삭제. 프로젝트·방명록은 지금 비어 있음(빈 상태 안내 문구가 보임).

보안 감사 (2026-11-09, cloudflare security-audit 스킬 standard, 소스 검토만. 보고서: `~/security-audit-skill/Team_Verne/run-1/REPORT.md`):
- 확정 0건(샌드박스 없어 실행 검증 불가), needs_validation 6건. 그중 4건은 커밋 0f30e21에서 고침:
  삭제 잠금 경쟁 조건·영구 잠금 괴롭히기·삭제 scrypt 부하(001 RPC + 삭제 IP 제한 10/10분),
  IP 제한 경쟁 조건(002 RPC), 뉴스 캐시 키 무한 증가(slug 목록으로 먼저 거름).
- 같이 반영: 보안 헤더(HSTS, frame-ancestors, nosniff 등), env.js server-only, 동의 문구 "암호화"→"해시",
  방명록 글쓰기 쿨다운 30초→10초.
- 남은 것: x-forwarded-for 맨 왼쪽 값 신뢰(배포 플랫폼 정해지면 `lib/forms/spamGuard.js` getClientIpHash만 수정),
  news RLS 정책 실제 내용 확인(`pg_policy` 조회), 의존성 `npm audit`(네트워크 되는 곳에서).
- 보류: 전체 CSP(nonce + proxy.js 필요).

다음 순서: **남은 내용 입력 → 배포**
- 갤러리: 사진 준비되면 `team-gallery` 버킷 업로드 + `gallery_photos` 등록, 샘플 사진 정리.
- 팀 소개(About > 팀 소개) 사진: `public/about/`에 `about-1.jpg`(16:9), `mission-1.jpg`·`mission-2.jpg`(4:5) 넣기.
  장수·이름 바꾸면 `features/about/IntroPage.js`의 `PHOTOS`만 수정. 없으면 회색 칸으로 보임.
- 프로젝트: 실제 프로젝트가 생기면 `projects` 등록(표지는 `project-covers` 버킷).
- 배포 때 확인: x-forwarded-for 신뢰 여부(IP 제한), 환경변수 7개 이관, allowedOrigins 비어 있는지,
  `docs/sql/` 적용 여부, HSTS는 첫 배포부터 2년 고정이니 http 전용 하위 도메인 없는지.
- Supabase 무료 플랜은 오래 안 쓰면 정지됨. 정지 중엔 `*.supabase.co`가 DNS에서 안 풀려 `fetch failed`가 남 → 대시보드에서 Resume.

미뤄둔 제안(사용자가 아직 고르지 않음): 한/영 404 페이지, 프로젝트 상세 본문·기간, 입력칸 테두리 대비 강화,
흰 로고 파일, 문의자 자동 확인 메일(도메인 필요), 문의 처리 상태 컬럼, img lint 경고 정리, 멤버 페이지네이션.
