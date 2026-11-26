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
  Teams(팀 분위기·팀 역사. 파트 페이지는 About 파트별 멤버 소개와 겹쳐서 2026-11-16 삭제) / Projects / 팀 응원 방명록 / 스폰서십 & 스폰서 문의
- 좌측 사이드바 내비. 상위 메뉴(About, Teams)는 hover/탭 시 하위 메뉴만 열고 페이지 이동 없음.
- KO/EN 전환: 쿠키 `locale`, 사전은 `lib/i18n/dictionaries/{ko,en}.js`

## 3. 디자인

- 다크 테마. 색은 전부 `styles/theme.css` 토큰으로만 쓴다(CSS에 색 직접 적지 않기).
  - `--color-primary #0233fb` 로고 파랑: 면(버튼·칩·뱃지·배너)에만. 그 위 글자는 `--color-on-primary`(흰색)
  - `--color-primary-strong #7c96ff`: 강조 글자·링크·포커스 링 (로고 파랑은 검은 배경에서 대비 2.87이라 글자로 쓰지 않음)
  - `--color-primary-soft #0f1f5c`: hover·활성 메뉴 배경
  - 보조 글자 `--color-text-muted`, 에러 `--color-danger`
- 새 글자/배경 조합을 만들면 `scripts/check-contrast.mjs`의 PAIRS에 추가하고 `npm run check:contrast` 통과 확인.
  입력칸 테두리는 `--color-border-field`(UI 경계 3:1 기준, PAIRS의 `UI`). 카드·구분선은 그대로 `--color-border`.
- 터치 대상 최소 44px: 크게 키워야 하면 `@media (pointer: coarse)` 안에서만(마우스 화면 크기 유지), 1~3px 차이는 기본값으로.
- 제목 위 작은 라벨 `.eyebrow`는 팀 소개 챕터 이름과 홈 "지금 진행 중"에만. 페이지 머리(h1 위)엔 안 씀(사이드바와 중복, 2026-11-24 삭제).
- 디자인 시스템 문서: `DESIGN.md`(+ `.impeccable/design.json`), 제품 맥락 `PRODUCT.md`. impeccable 감사 보고서는 `.impeccable/audit/`(git 제외).
- 로고: `public/logo.svg`(파랑, 사이드바에 사용), `public/logo-black.svg`. 원본 비율 960×300.
  파비콘: `app/icon.svg`(파란 사각형 + 흰 로고). 로고 교체는 `lib/config/site.js`만 수정.
- 폰트: Pretendard 가변 폰트, 동적 서브셋(`lib/config/fonts.js` 한 파일에서 교체).
  굵기 가이드: 메인 타이틀/메뉴 Bold(700), 서브 타이틀 SemiBold(600), 본문 Regular(400), 부가 정보 Regular/Light.

## 4. 코드 구조와 규칙

app/ 라우트만 얇게. 실제 화면은 features/에서 가져온다
features/<기능>/ 기능별 코드 (layout, home, about, teams, projects, guestbook, sponsorship)


- DB 읽기: 공개 데이터는 `createCachedQuery`/`createCachedFn` + anon 클라이언트. 실패는 `{ failed: true }`로 섹션만 안내 문구.
  캐시 label 중복 검사는 production에서만(dev는 hot reload로 같은 label이 다시 들어옴). 진짜 중복은 `npm run build`에서 잡힘.
- DB 쓰기: 반드시 Server Action(`"use server"`)에서 검증 후 `createSupabaseAdminClient()`. 브라우저에서 직접 쓰기 금지.
- 다국어 컬럼은 `<field>_ko`, `<field>_en`. 사전에 없는 키·컬럼은 렌더링 때 에러(오타를 바로 잡기 위해 의도적).
- 캐시 즉시 무효화: `POST /api/revalidate` + `Authorization: Bearer $REVALIDATE_SECRET`.
  - 언제: Supabase 대시보드에서 데이터를 직접 고친 뒤 바로 반영하고 싶을 때. 안 불러도 60초(`CACHE_SECONDS`) 지나면 자동 갱신.
  - 범위: 모든 DB 조회가 태그 `supabase-data` 하나를 공유해서 한 번 호출로 전부 무효화. 요청 본문 없음, 태그 지정 불가.
  - 응답: 200 `{ok:true}` / 401 시크릿 틀림 / 503 서버에 REVALIDATE_SECRET 없음 / 500 무효화 실패. GET 등은 405.
  - 호출 (Git Bash, 시크릿을 명령에 직접 적지 않음. 배포 후엔 주소만 바꾸고 배포 환경의 시크릿 사용):
    ```bash
    curl -X POST http://localhost:3000/api/revalidate \
      -H "Authorization: Bearer $(grep '^REVALIDATE_SECRET=' .env.local | cut -d= -f2- | tr -d '\r\"')"
    ```
- 이미지: Supabase Storage 공개 버킷, DB에는 파일명만. 허용 버킷은 `next.config.mjs`의 IMAGE_BUCKETS와 각 URL 함수에 같이 등록.
- Server Action 출처 허용(allowedOrigins)은 Codespaces에서만 켜지고 로컬/배포에서는 비어 있음.

## 5. Supabase (기본 스키마는 SQL Editor에서 직접 만들었고 저장소에 없음. 2026-11-09 이후 추가분은 `docs/sql/`)

모든 테이블 RLS 켜짐. anon은 공개 테이블 SELECT만, 쓰기 권한 회수.
- 공개 읽기: `projects`, `news`(published_at <= now()만), `departments`, `project_departments`, `project_members`, `members`,
  `history_events`, `gallery_photos`
- anon 접근 완전 차단(관리자 키로만): `guestbook_entries`(password_hash는 scrypt), `sponsorship_inquiries`,
  `submission_log`(IP는 HMAC 해시, 24시간 보관)
- 공개 버킷: `project-covers`, `member-photos`, `news-images`, `team-gallery` (jpg/png/webp, 2MB, 쓰기 정책 없음)
- 주요 CHECK: slug `^[a-z0-9-]+$`, 이미지 파일명 규칙, 글자 수 제한. 코드 검증 상수와 값을 맞춘다.
- `docs/sql/` (번호 순서대로 SQL Editor에서 실행, 새 환경 만들 때 다시 실행. 현재 DB는 001~004 적용 확인 2026-11-16, 005·006 적용 2026-11-25: 함수·칸·테이블·인덱스, cron 2개 active·succeeded, anon RPC 실행 401):
  - `001` `guestbook_reserve_delete_attempt` RPC + `guestbook_entries.delete_locked_until` (삭제 시도 원자 예약, 5회 → 15분 잠금)
  - `002` `submission_try_reserve` RPC + 인덱스 (IP 제한 확인·기록 원자화, 부작용 전에 호출)
  - `003` pg_cron: submission_log 24시간 정리(매시), cron.job_run_details 7일 정리
  - `004` `project_members` 테이블(project_id, member_id) + anon SELECT만. 프로젝트 상세에 "만든 사람" 표시. 코드가 같이 조회하므로 없으면 Projects 전체가 에러 안내로 보임
  - `005` `projects`에 `body_ko`/`body_en`(마크다운, 기본 '', 각 2만 자) + `started_on`/`ended_on`(date, 종료일은 시작일 이후). 코드가 같이 조회하므로 없으면 Projects 전체가 에러 안내
  - `006` `sponsorship_inquiries.status`(new/in_progress/done, 기본 new). 대시보드에서만 바꿈, 코드는 안 씀. 사용법 `docs/manuals/sponsorship-inquiry-status.md`
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
lint 경고 없음(소식 본문 이미지도 2026-11-25 next/image로 바꿈, 버킷 news-images를 IMAGE_BUCKETS에 추가).
build는 dev 서버를 켠 채로도 성공하지만, 2026-11-24엔 build 도중 dev 서버가 꺼졌고 2026-11-25엔 dev 서버가 옛 코드로 계속 응답함(새 컬럼에서 "Missing localized field"). build 뒤 이상하면 dev 서버 재시작부터.

## 8. 진행 상황

완료: 레이아웃/다국어/모바일 메뉴, Home, About, Teams(모션은 motion 라이브러리, reduced-motion 대응),
Projects(파트 필터·상세), 방명록(허니팟·쿨다운·IP 제한·삭제 잠금·페이지네이션), 스폰서 문의(Resend 알림),
브랜딩(로고·다크 테마·Pretendard·팀 소개 문구).
한/영 404 (2026-11-25): `app/not-found.js` → `features/notFound/`. 없는 주소와 `notFound()` 둘 다 이 화면, 사전 키 `notFound`.

실제 내용 입력 (2026-10-14):
- 멤버: 이휘성(기획·개발 파트 리더, lee.jpg), 윤태중(기획·디자인, yoon.jpg), 개발 1자리는 `공석`/`Vacant`.
- 소식: 샘플 15개와 sample-news.jpg 삭제. "이휘성 전역 D-19"(team, 전역일 2026-11-02) 1개만 있음. D-19는 고정 글자.
- 팀 역사: 사용자가 이미 채움.
- 샘플 정리 (2026-11-12): sample-* 프로젝트 4개(+project_departments, project-covers의 sample-active.jpg, missing.jpg 값),
  방명록 테스트 글 2개, member-photos의 sample-member-a.jpg 삭제. 방명록은 지금 비어 있음(빈 상태 안내 문구가 보임).
- 프로젝트 (2026-11-16): `first-project` "TeamWV 웹페이지" 1개. active + is_featured(홈 배너·대표 칸 둘 다),
  표지 first_project_cover.png, 파트 디자인·개발(기획은 사용자가 일부러 뺌, 2026-11-25 확인), 만든 사람 윤태중·이휘성.

보안 감사 (2026-11-09, cloudflare security-audit 스킬 standard, 소스 검토만. 보고서: `~/security-audit-skill/Team_Verne/run-1/REPORT.md`):
- 확정 0건(샌드박스 없어 실행 검증 불가), needs_validation 6건. 그중 4건은 커밋 0f30e21에서 고침:
  삭제 잠금 경쟁 조건·영구 잠금 괴롭히기·삭제 scrypt 부하(001 RPC + 삭제 IP 제한 10/10분),
  IP 제한 경쟁 조건(002 RPC), 뉴스 캐시 키 무한 증가(slug 목록으로 먼저 거름).
- 같이 반영: 보안 헤더(HSTS, frame-ancestors, nosniff 등), env.js server-only, 동의 문구 "암호화"→"해시",
  방명록 글쓰기 쿨다운 30초→10초.
- 남은 것: x-forwarded-for 맨 왼쪽 값 신뢰(배포 플랫폼 정해지면 `lib/forms/spamGuard.js` getClientIpHash만 수정).
- news RLS (2026-11-16): RLS 켜짐(force는 꺼짐, Supabase 기본). 정책은 `news public read` 하나(SELECT, anon,
  `published_at <= now()`). 쓰기 정책 없음. 미래 날짜 테스트 글로 확인: anon에 안 보임, anon 쓰기 401.
- npm audit (2026-11-16): next 16.3.5→16.4.6, sharp·zod·source-map-js 패치. 남은 moderate 7건은 typescript-eslint 안 minimatch(개발 도구, 상위 수정판 없음).
- 보류: 전체 CSP(nonce + proxy.js 필요).

디자인 감사 (2026-11-24, impeccable audit 3회: 16 → 17 → 19/20. 커밋 35ac524, push 완료):
- 접근성: KO/EN 토글 22px→28px(터치 44px), 입력칸 테두리 대비 1.3→3.7, 본문 바로가기 링크(`sidebar.skipToContent`),
  팀 역사 제목 h3→h2, 갤러리 alt 비움(캡션과 중복).
- 터치 44px: 사이드바 메뉴·로고·인스타, 필터 칩, 뒤로 링크, 페이지 이동, 동의 체크 줄, 기본 버튼·입력칸. 홈 최신 소식은 줄 전체 클릭.
- 성능: 팀 분위기 갤러리를 next/image로(원본 3000px → 828px 30KB, 모바일 Fast 4G LCP 2.68→0.92초).
- 정리: 페이지 머리 eyebrow 7곳 삭제, 폼 안 개인정보 이중 테두리 제거.
- 의도적으로 남긴 것(검사기가 지적하지만 유지): 팀 소개 챕터 eyebrow, 홈 배너 2px 파란 윗선.
- 소식 본문 이미지(2026-11-25): next/image, 16:9(1600×900)로 자리 잡고 로드 후 실제 비율. 비율 다르면 살짝 흔들림, 작은 원본은 칸 너비까지 늘어남. 실제 이미지로는 아직 확인 안 함(본문 이미지 0장).
- 확인 못 한 것: 실제 폰·Safari, 스크린리더 직접 사용.
  → 2026-11-26 배포 사이트로 확인: 갤럭시(사용자 직접) 문제 없음. Safari는 Playwright WebKit 18.2로 대신 확인
    (아이폰 13 390×844 + 맥 1280, 13페이지씩): 가로 넘침 0, 깨진 이미지 0, 콘솔 에러 없음(404 페이지의 404 응답만),
    모바일 메뉴 열기→About→팀 소개 이동 정상. 실제 iOS(노치·주소창·터치)와 스크린리더는 여전히 미확인.
- 대표 프로젝트 표지 first_project_cover.png: 3000×2250 흰 캔버스 왼쪽 위에 1901×903 캡처가 붙은 파일이라 흰 여백이 보였음(코드는 object-fit: cover로 정상, 2026-11-25 확인). 여백 잘라낸 1901×903 파일로 같은 이름 덮어씀(2026-11-25).

다음 순서: **남은 내용 입력 → 배포**
- 갤러리: 사진 추가는 `team-gallery` 버킷 업로드 + `gallery_photos` 등록. 샘플 3개(행·파일) 2026-11-16 삭제, 실제 사진 1장 있음.
- 팀 소개(About > 팀 소개) 사진: Supabase `team-gallery` 버킷에 `about-1.jpg`(16:9), `mission-1.jpg`·`mission-2.jpg`(4:5) 업로드(DB 등록 없음, 배포 불필요). 같은 이름으로 교체하면 이미지 캐시 때문에 최대 4시간 늦게 바뀜.
  장수·이름 바꾸면 `features/about/IntroPage.js`의 `PHOTOS`만 수정. 없으면 회색 칸으로 보임.
  → 3장 모두 업로드 완료(2026-11-26, mission-1·2는 1500×1875로 잘라서). 배포 사이트에서 표시 확인.
  패럴랙스 때문에 사진이 칸보다 위아래 10%씩 크게 그려져 가장자리가 조금 잘려 보이는 건 의도.
- 프로젝트 추가: 표지 `project-covers` 업로드 → `projects` 행(status `active`/`completed`, is_featured, sort_order, cover_path는 파일명만)
  → `project_departments`(파트), `project_members`(만든 사람)에 연결 행. 진행 중 배너는 active 중 sort_order 가장 작은 1개,
  대표는 is_featured 최대 3개. 만든 사람은 파트 순서(기획→디자인→개발) 다음 멤버 순서로 표시되고, 멤버가 파트별 행이라 어느 행을 연결하느냐로 위치가 정해짐.
  상세 본문은 `body_ko`/`body_en`(마크다운, 비우면 안 보임, 이미지는 `news-images` 버킷만), 기간은 `started_on`/`ended_on`(시작일 없으면 안 보임, 종료일 없으면 "시작일 ~").
- 배포 결정 (2026-11-26): **Vercel**, 먼저 `*.vercel.app` 무료 주소로 배포 → 도메인은 나중에 사서 연결(그때 문의자 확인 메일).
  계획 파일: `~/.claude/plans/cosmic-questing-dewdrop-of-0b90b7de-4ae9-40b3-981a-4c82dcf8f73e.md`
  - x-forwarded-for: Vercel이 덮어씀(문서 확인) → `getClientIpHash` 코드 그대로, 주석만 갱신. Vercel 앞에 프록시 두면 재검토.
  - allowedOrigins: production이면 자동 `[]`(코드 확인). 환경변수는 **첫 빌드 전에** 넣기(next.config가 SUPABASE_URL 없으면 빌드 실패).
  - 환경변수는 Production에만(Preview엔 안 넣음). 함수 지역은 Supabase 지역에 맞춤.
  - 플랜: Hobby. 스폰서 문의는 유지(돈이 오가지 않음). 실제 후원금이 생기면 Pro 재검토.
- **첫 배포 완료 (2026-11-26): https://teamwv.vercel.app/** (Vercel 프로젝트 `teamwv`, 팀 `hwynn18s-projects`, GitHub main push 시 자동 배포)
  - 함수 지역 icn1(서울) 하나, Supabase ap-northeast-2와 같음. 응답 헤더 `X-Vercel-Id: icn1::icn1` 확인.
  - 환경변수 7개 Production에만(Preview 제외). Supabase 연동(Vercel 마켓플레이스)은 추가 안 함.
  - 확인 결과: 페이지 12개 200 + 없는 주소 404, KO/EN 전환, 이미지(표지·멤버·갤러리), 콘솔 에러 없음,
    보안 헤더 6종(HSTS·CSP frame-ancestors·X-Frame-Options·nosniff·Referrer-Policy·Permissions-Policy),
    `/api/revalidate` 시크릿 없음/틀림 401·GET 405·올바름 200, 배포 JS 청크 12개에 비밀값 4종 없음.
  - 쓰기 테스트 통과: 스폰서 문의 1건(행 생성·status new·알림 메일 사용자 확인) → 테스트 행 삭제(기존 문의 2건 유지),
    방명록 글쓰기·삭제(사용자 진행). submission_log에 sponsorship·guestbook-post·guestbook-delete 3건, IP 해시 64자
    → **Vercel에서 x-forwarded-for 정상 동작 확인**.
  - 남은 것: 도메인 구매·연결(그때 HSTS 하위 도메인 재점검) + 문의자 확인 메일.
- 배포 때 확인: x-forwarded-for 신뢰 여부(IP 제한), 환경변수 7개 이관, allowedOrigins 비어 있는지,
  `docs/sql/` 적용 여부, HSTS는 첫 배포부터 2년 고정이니 http 전용 하위 도메인 없는지.
  배포 후 `/api/revalidate` 200 확인(로컬 프로덕션에서 원인 불명 500 한 번, 재빌드 후 재현 안 됨).
- 문의자 자동 확인 메일(배포 때 같이): 도메인 구매 → Resend 도메인 인증(DNS SPF·DKIM) → 코드(보내는 주소 환경변수화,
  확인 메일 내용 한/영, 문의 저장 후 발송, 실패해도 접수 성공 유지). 확인 메일엔 문의 내용 그대로 넣지 않고 짧게(남의 주소로 스팸 악용 방지).
- Supabase 무료 플랜은 오래 안 쓰면 정지됨. 정지 중엔 `*.supabase.co`가 DNS에서 안 풀려 `fetch failed`가 남 → 대시보드에서 Resume.

장기 계획: 백엔드를 NestJS로 분리 (2026-11-25, 사용자 결정). 웹페이지 완성·배포 완료 후 시작, 그 전엔 시작하지 않는다.
- 목표 구조: 프론트엔드 Next.js(화면, 라우팅, 다국어 표시는 그대로) + 백엔드 NestJS(서버 기능 전부를 API로).
- 목적은 학습. **코드는 사용자가 직접 수정한다.** Claude는 동작 원리·백엔드 개념·왜 그렇게 하는지를 설명하고,
  사용자가 쓴 코드를 검토(예외 처리·보안 포함)한다. 사용자가 요청하지 않으면 Claude가 대신 코드를 써 주지 않는다.
- 순서: ① NestJS 백엔드로 옮기기(사용자의 NestJS 독학 내용 + Claude 설명) → ② 옮긴 뒤 Next.js 쪽을 Claude 설명으로 다시 공부.
- NestJS로 옮길 대상(현재 Next.js 서버 쪽에 있는 것):
  - 공개 데이터 읽기: 프로젝트·소식·멤버·파트·팀 역사·갤러리 (`features/*/…Queries.js`, `lib/cache/` 60초 캐시, 실패 시 `{ failed: true }`)
  - 방명록 쓰기·삭제: `features/guestbook/actions.js` (scrypt 비밀번호 해시, `001` 삭제 잠금 RPC, 페이지네이션)
  - 스폰서 문의: `features/sponsorship/actions.js` (검증, 저장, Resend 알림 메일, 확인 메일은 배포 때 추가 예정)
  - 스팸 방지: `lib/forms/spamGuard.js` (허니팟, 쿨다운, IP HMAC 해시, `002` IP 제한 RPC)
  - 캐시 무효화: `app/api/revalidate` (Bearer 시크릿)
  - 환경변수·서비스 키는 백엔드로만. 브라우저/Next.js 프론트에 서비스 키가 가면 안 됨.
- 공부 범위: 기능 코드만이 아니라 **이 웹페이지 백엔드에 관한 지식 전부**. 코드를 옮기기 전에 "무엇을, 왜 이렇게 만들었는지"부터 설명한다.
  - DB 스키마: 테이블 목록과 관계(projects↔departments/members 연결 테이블, members→departments 등), 칸 설계 이유
    (`<field>_ko/_en` 다국어 칸, 이미지는 파일명만 저장, slug 규칙, `sort_order`, `published_at` 예약 공개)
  - 제약 조건: CHECK(글자 수·slug·파일명·상태 값)를 왜 DB와 코드 양쪽에 두는지, 값이 서로 맞아야 하는 이유
  - 권한: RLS 원리, anon(공개 읽기만)과 service_role(쓰기)의 구분, 어떤 테이블을 왜 완전히 막았는지(방명록·문의·로그)
  - RPC와 동시성: `001` 삭제 잠금·`002` IP 제한을 왜 DB 함수로 원자 처리하는지(경쟁 조건, 보안 감사 2026-11-09 지적)
  - 데이터 정리: `003` pg_cron으로 로그 24시간 보관, 개인정보 최소 보관 이유
  - Storage: 공개 버킷 구조, 업로드 권한 없음, 이미지 최적화 허용 목록(`IMAGE_BUCKETS`)
  - 캐시: 60초 캐시, 태그 하나로 전체 무효화, 실패는 캐시하지 않는 이유, dev 서버가 옛 코드를 쥐는 함정
  - 보안: scrypt 비밀번호 해시, IP HMAC 해시, 허니팟·쿨다운·IP 제한, 보안 헤더(HSTS 등), 시크릿 관리, x-forwarded-for 신뢰 문제
  - 예외 처리 원칙: 조회 실패는 섹션만 안내 문구(`{ failed: true }`), 저장 성공 후 메일 실패는 성공 처리, 사전 조건 안 맞으면 빠르게 실패
  - 외부 서비스: Resend 메일(도메인 인증, 헤더 줄바꿈 방어), Supabase 무료 플랜 정지
  - 설계 기록: 이 문서의 보안 감사·디자인 감사·SQL 기록이 "왜"의 근거. 공부할 때 같이 본다.
- 공부 시작 전 준비: 기본 스키마는 SQL Editor에서 직접 만들어 저장소에 없다(`docs/sql/`엔 001 이후 추가분만).
  공부 시작할 때 현재 DB 스키마(테이블·칸·제약·RLS 정책)를 SQL 파일로 뽑아 저장소에 남겨 두고 그걸 교재로 쓴다.
- 그대로 Next.js에 남는 것: 화면 컴포넌트, 라우트, 사이드바, KO/EN 쿠키·사전, 이미지 표시(next/image), 디자인 토큰.
- 옮길 때 같이 정할 것(그때 사용자와 결정): Next.js → NestJS 호출 방식(서버에서 fetch, CORS), 캐시를 어느 쪽에 둘지,
  Server Action을 API 호출로 바꾸는 방식, NestJS 배포 위치, 지금의 RLS·service_role 구조 유지 여부.

미뤄둔 제안(사용자가 아직 고르지 않음):
흰 로고 파일(나중에), 멤버 페이지네이션(보류: 3명이라 화면 변화 없음, 파트가 쪽을 넘는 문제. 12명쯤 넘으면 진행. 추천은 "파트 필터"(Projects 필터 방식), 대안 "12명씩", 2026-11-25). 문의자 자동 확인 메일은 배포 때 도메인 정하면서 진행(2026-11-25 결정).
(입력칸 테두리 대비 강화는 2026-11-24 반영됨)
