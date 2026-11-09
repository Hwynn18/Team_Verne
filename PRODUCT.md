# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **지인·팬**: 친구, 가족, 인스타그램(teamwv_05) 팔로워. 팀 근황을 보고 방명록에 응원을 남긴다.
- **채용·입시 담당자**: 멤버 개인의 포트폴리오 링크로 들어와서 팀 활동과 실제 결과물을 확인한다. 짧은 시간 안에 "이 사람들이 실제로 뭘 만들었나"를 판단한다.

## Product Purpose

Team WV의 공식 웹사이트. 열다섯에 만난 친구들이 만든 팀이고, 개발에 머물지 않고 기획, 디자인 등 무엇이든 직접 부딪히며 경험을 쌓는다.
성공 기준: 방문자가 **프로젝트를 보고 팀의 실력을 믿게 되는 것**. 응원(방명록, 인스타)과 스폰서 문의는 그다음이다.

## Positioning

학생 시절부터 함께해 온 친구들이 개발, 기획, 디자인을 한 팀으로 직접 해내는 것. 비전 문구: "내 인생은, 내가 정한다." / 지향점: "후회 없이, 눈치 보지 않고, 도전한다."

## Operating Context

- 메뉴: Home / About(팀 소개, 파트별 멤버, 소셜, 소식) / Teams(팀 분위기, 팀 역사, 파트) / Projects / 팀 응원 방명록 / 스폰서십 & 스폰서 문의
- KO/EN 두 언어. 쿠키 `locale`로 전환.
- 내용은 Supabase에서 팀이 직접 관리(멤버, 소식, 연혁, 갤러리, 프로젝트).

## Capabilities and Constraints

- Next.js 16 App Router(JavaScript), CSS Modules, Supabase, Resend. 자세한 규칙은 `docs/claude/project-context.md`.
- 방명록: 허니팟, 쿨다운, IP 해시 제한, 비밀번호로 삭제.
- 스폰서 문의: 폼 제출 시 Resend로 팀에 메일 알림.
- 멤버 3자리: 이휘성(기획·개발 파트 리더), 윤태중(기획·디자인), 개발 1자리 공석.

## Brand Commitments

- **고정**: 팀 이름 "Team WV"(옛 표기 Team Verne는 쓰지 않음), 로고(`public/logo.svg`, `public/logo-black.svg`, 비율 960×300). 로고 교체는 `lib/config/site.js`에서만.
- 그 밖의 테마, 색, 폰트, 레이아웃은 바꿔도 된다(2026-11-09 사용자 확인). 현재 구현(다크 테마, 로고 파랑 #0233fb, Pretendard, 좌측 사이드바)은 기존 상태일 뿐 약속이 아니다.

## Evidence on Hand

- 실제 내용: 팀 소개 문구(사전 `lib/i18n/dictionaries/`), 멤버 2명 사진(lee.jpg, yoon.jpg), 팀 역사, 소식 1건.
- **없는 것**: 실제 프로젝트는 아직 없고 샘플만 있다. 갤러리 사진도 샘플뿐이다. 프로젝트 성과, 수상, 추천사, 고객사, 수치를 지어내지 않는다.

## Product Principles

1. 실력은 말이 아니라 결과물로 보여준다. 프로젝트가 사이트의 중심이다.
2. 짧게 훑어보는 평가자도 팀이 누구이고 무엇을 했는지 바로 알 수 있어야 한다.
3. 친구들이 모인 팀의 진짜 이야기를 과장 없이 전한다.
4. 팀이 직접 내용을 채우고 바꿀 수 있어야 한다. 비어 있는 상태도 어색하지 않게.

## Accessibility & Inclusion

- 글자/배경 대비는 `npm run check:contrast`로 검사한다(새 조합은 `scripts/check-contrast.mjs` PAIRS에 추가).
- 모션은 `prefers-reduced-motion`을 존중한다.
- 한국어와 영어 모두 같은 품질로 지원한다.
