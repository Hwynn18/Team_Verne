---
name: Team WV
description: 열다섯에 만난 친구들이 만든 팀의 공식 웹사이트. 어두운 작업실 위에 로고 파랑을 아껴 찍는다.
colors:
  logo-blue: "#0233fb"
  logo-blue-hover: "#2a52ff"
  signal-blue: "#7c96ff"
  night-blue: "#0f1f5c"
  blue-glow: "rgb(2 51 251 / 0.18)"
  on-blue: "#ffffff"
  workshop-black: "#0a0b10"
  bench-gray: "#12141b"
  lamp-gray: "#1a1d27"
  seam-gray: "#232735"
  paper-white: "#f3f5fa"
  pencil-gray: "#9aa1b2"
  faded-gray: "#5d6375"
  warning-red: "#f87171"
  warning-red-soft: "#2a1212"
  backdrop: "rgb(0 0 0 / 0.6)"
typography:
  display:
    fontFamily: "Pretendard Variable, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "clamp(56px, 9vw, 128px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Pretendard Variable, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "clamp(32px, 4.5vw, 44px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Pretendard Variable, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    letterSpacing: "-0.02em"
  subtitle:
    fontFamily: "Pretendard Variable, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
  body:
    fontFamily: "Pretendard Variable, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  meta:
    fontFamily: "Pretendard Variable, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  label:
    fontFamily: "Pretendard Variable, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.12em"
rounded:
  sm: "4px"
  md: "8px"
  full: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "56px"
  page-x: "40px"
  page-x-mobile: "20px"
  content-max: "1080px"
  sidebar: "240px"
components:
  button-primary:
    backgroundColor: "{colors.logo-blue}"
    textColor: "{colors.on-blue}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.logo-blue-hover}"
  chip:
    textColor: "{colors.paper-white}"
    rounded: "{rounded.sm}"
    padding: "6px 14px"
  chip-active:
    backgroundColor: "{colors.logo-blue}"
    textColor: "{colors.on-blue}"
  badge:
    backgroundColor: "{colors.lamp-gray}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.full}"
    padding: "3px 10px"
  badge-release:
    backgroundColor: "{colors.logo-blue}"
    textColor: "{colors.on-blue}"
  card:
    backgroundColor: "{colors.bench-gray}"
    rounded: "{rounded.md}"
    padding: "24px"
  card-hover:
    backgroundColor: "{colors.lamp-gray}"
  input:
    backgroundColor: "{colors.workshop-black}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
  nav-item-active:
    backgroundColor: "{colors.night-blue}"
    textColor: "{colors.signal-blue}"
---

# Design System: Team WV

## Overview

**Creative North Star: "밤의 작업실 (The Night Workshop)"**

친구들이 밤에 모여 뭔가를 만드는 작업실이야. 불을 다 켜지 않은 어두운 방에서 작업대(카드·패널)가 한 단계 밝게 떠 있고, 그 위에 놓인 결과물(프로젝트 표지, 사진, 큰 제목)이 눈에 들어와. 로고 파랑은 작업실의 스탠드 불빛처럼 꼭 봐야 하는 곳(버튼, 활성 메뉴, 배너 윗선)에만 켜.

분위기는 **친근하고 가볍게**. 그림자, 두꺼운 테두리, 장식용 그래픽은 쓰지 않아. 얇은 선(1px)과 면의 밝기 차이로만 구분하고, 모서리는 살짝 둥글어(4·8px). 큰 한글 제목은 굵고 자간을 좁혀서 단단하게 세우고, 나머지는 조용히 물러나 있어.
**Key Characteristics:**
- 거의 검은 쿨톤 바탕 위 3단계 면 (페이지 < 작업대 < 손 닿는 곳)
- 로고 파랑은 면에만, 파란 글자는 밝힌 신호 파랑으로
- 그림자 없이 1px 선과 면 밝기로 깊이 표현
- Pretendard 하나로 굵기만 바꿔 위계를 만든다
- 좌측 고정 사이드바 + 최대 1080px 본문

## Colors

차가운 남색 기가 도는 검정 계열 위에 로고 파랑 하나만 쓰는 팔레트야.

### Primary
- **로고 파랑 (Logo Blue)**: 팀 로고와 같은 값. 버튼, 선택된 칩, 출시 뱃지, 언어 토글 선택칸, 배너 윗선 같은 좁은 **면**에만 써. 검은 바탕 위 글자로 쓰면 대비가 2.87이라 글자색으로는 절대 안 써.
- **밝힌 로고 파랑 (Logo Blue Hover)**: 로고 파랑 버튼의 hover.
- **신호 파랑 (Signal Blue)**: 파란 글자가 필요할 때 쓰는 색. 링크, 강조 글자, 섹션 라벨(eyebrow), 활성 메뉴 글자, 카드 hover 테두리, 포커스 링.
- **밤 파랑 (Night Blue)**: 활성 메뉴 배경, 성공 안내 배경, 아바타 빈 자리 배경.
- **파란 빛 (Blue Glow)**: 배너 오른쪽 위 모서리에서 번지는 옅은 빛. 장식 전용이고 글자 뒤 배경으로 쓰지 않아.
- **파랑 위 흰색 (On Blue)**: 로고 파랑 면 위의 모든 글자.

### Neutral
- **작업실 검정 (Workshop Black)**: 페이지 바탕, 사이드바, 입력칸 안쪽.
- **작업대 회색 (Bench Gray)**: 카드, 폼, 배너, 하위 메뉴 패널.
- **스탠드 회색 (Lamp Gray)**: hover된 카드, 하위 메뉴 항목 hover, 기본 뱃지.
- **이음새 회색 (Seam Gray)**: 모든 1px 테두리와 구분선.
- **종이 흰색 (Paper White)**: 본문 글자.
- **연필 회색 (Pencil Gray)**: 날짜, 힌트, 요약, 슬로건 같은 보조 글자.
- **바랜 회색 (Faded Gray)**: 비활성 글자. 대비 기준 예외라 읽어야 하는 글자에는 쓰지 않아.
- **경고 빨강 / 옅은 경고 빨강 (Warning Red / Soft)**: 오류 글자·테두리와 오류 안내 배경.

### Named Rules
**The Lamp Rule.** 로고 파랑은 면에만 켠다. 파란 글자는 언제나 신호 파랑이다.

**The Token-Only Rule.** CSS에 색을 직접 적지 않는다. 전부 `styles/theme.css` 토큰을 쓰고, 새 글자/배경 조합은 `scripts/check-contrast.mjs`의 PAIRS에 추가한 뒤 `npm run check:contrast`를 통과시킨다.

## Typography

**Display Font:** Pretendard Variable (with Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, system-ui)
**Body Font:** 같은 Pretendard Variable

**Character:** 글꼴은 하나만 쓰고 굵기로 위계를 나눠. 큰 제목은 700에 자간 -0.02em으로 단단하게, 본문은 400으로 편하게 읽혀.

### Hierarchy
- **Display** (700, clamp 56–128px, 행간 1): 홈 히어로의 팀 이름. 팀 소개 슬로건은 더 커서 clamp 56–160px.
- **Headline** (700, clamp 32–44px, 행간 1.2): 페이지 제목, 배너 프로젝트 이름, 상세 제목.
- **Title** (600, 28px): 섹션 제목.
- **Subtitle** (600, 20px): 카드 제목, 멤버 이름, 히어로 아래 슬로건(연필 회색).
- **Body** (400, 16px, 행간 1.7–1.8): 본문과 요약. 요약은 최대 60ch.
- **Meta** (400, 14px): 날짜(숫자 고정폭), 힌트, 칩 글자.
- **Label** (600, 12px, 자간 0.12em, 대문자): 제목 위 eyebrow. 신호 파랑.

### Named Rules
**The Keep-All Rule.** 한글 제목(h1–h3)은 `word-break: keep-all`로 어절 단위 줄바꿈. 글자 중간에서 끊지 않는다.

**The Weight Ladder Rule.** 메인 타이틀·메뉴 700, 서브 타이틀 600, 본문 400, 부가 정보 400/300. 이 네 단계 밖의 굵기는 쓰지 않는다.

## Layout

화면 왼쪽에 240px 사이드바가 고정되고, 본문은 최대 1080px 폭에 좌우 40px 여백으로 가운데 정렬돼. 글이 주인 페이지는 틀은 1080px 그대로 두고 내용만 780px(팀 소개 본문은 720px)로 좁혀서 왼쪽 시작선을 맞춰.

섹션 사이 간격은 홈 56px, 일반 페이지 28–32px. 카드 그리드는 `auto-fit` 최소 240–260px, 간격 20px.

768px 이하(모바일)에서는 사이드바가 왼쪽에서 밀려 나오는 패널(최대 85vw)이 되고, 오른쪽 위에 44px 메뉴 버튼이 고정돼. 하위 메뉴는 아코디언으로 바뀌고, 본문 좌우 여백은 20px, 2열 이상 배치는 1열이 돼.

## Elevation & Depth

그림자를 쓰지 않아. 깊이는 면 밝기 3단계(작업실 검정 → 작업대 회색 → 스탠드 회색)와 1px 이음새 회색 테두리로만 표현해. 위로 떠오르는 느낌이 필요한 곳은 hover 때 면을 한 단계 밝히고 테두리를 신호 파랑으로 바꾸는 걸로 대신해. 활성 메뉴는 그림자 대신 왼쪽 안쪽 3px 신호 파랑 선(`inset box-shadow`)을 쓰는데, 깊이가 아니라 표시선이야.

### Named Rules
**The Flat Bench Rule.** 작업대는 바닥에 붙어 있다. 그림자로 띄우지 말고 밝기로 구분한다.

## Shapes

모서리는 세 단계. 버튼·칩·입력칸·작은 이미지는 4px, 카드·패널·큰 이미지는 8px, 뱃지·태그는 알약형(999px). 아바타만 완전한 원이야. 카드 안 표지 이미지는 카드 모서리에서 1px을 뺀 값으로 위쪽만 둥글려. 테두리는 언제나 1px이고, 강조할 때만 배너 윗선처럼 2px 로고 파랑을 써. 비어 있는 상태나 안내 문구 상자는 점선 테두리야.

## Components

전체적으로 친근하고 가벼워. 장식 없이 바로 눌러 보고 싶게 만들어.

### Buttons
- **Shape:** 살짝 둥근 모서리 (4px)
- **Primary:** 로고 파랑 면, 흰 글자 700, 여백 12px 24px (배너 버튼은 12px 20px).
- **Hover / Focus:** 0.15초 동안 밝힌 로고 파랑으로 바뀌어. 포커스는 전역 2px 신호 파랑 외곽선 (간격 2px).
- **Disabled:** 투명도 0.6, 커서 progress (제출 중).
- **Text link (보조):** 신호 파랑 600 글자, 최소 높이 44px, hover 때 밑줄.

### Chips
- **Style:** 테두리 1px 이음새 회색, 4px 모서리, 14px 600 글자.
- **State:** hover 때 스탠드 회색 면 + 신호 파랑 테두리. 선택되면 로고 파랑 면 + 흰 글자. 프로젝트 파트 필터에 써.

### Badges
- **Style:** 알약형, 12px 700 글자, 스탠드 회색 면. 출시(release) 소식만 로고 파랑 면.

### Cards / Containers
- **Corner Style:** 8px
- **Background:** 작업대 회색, hover·포커스 때 스탠드 회색
- **Shadow Strategy:** 없음 (Elevation 참고)
- **Border:** 1px 이음새 회색, hover 때 신호 파랑. 0.15초 전환.
- **Internal Padding:** 24px. 카드 전체가 링크(제목 링크의 `::after`가 카드를 덮음).

### Inputs / Fields
- **Style:** 작업실 검정 안쪽, 1px 이음새 회색 테두리, 4px 모서리, 여백 10px 14px. 라벨은 14px 700, 힌트는 14px 연필 회색.
- **Focus:** 2px 신호 파랑 외곽선 (간격 1px).
- **Error:** 옅은 경고 빨강 면 + 경고 빨강 글자 안내 상자. 성공 안내는 밤 파랑 면 + 신호 파랑 글자.
- **Form container:** 작업대 회색 패널, 8px 모서리, 안쪽 28px (모바일 20px).

### Navigation
- **Style:** 좌측 고정 사이드바, 작업실 검정 바탕, 오른쪽 1px 이음새 선. 메뉴는 700, 여백 14px 24px.
- **States:** hover 때 작업대 회색 면. 활성은 밤 파랑 면 + 신호 파랑 글자 + 왼쪽 3px 신호 파랑 선.
- **Flyout:** 상위 메뉴(About, Teams)는 이동 없이 오른쪽에 하위 메뉴 패널을 연다. 작업대 회색, 오른쪽 모서리만 8px, 0.15초 동안 4px 옆에서 미끄러지며 나타나.
- **Mobile:** 0.2초 슬라이드 패널 + 반투명 검정 막, 하위 메뉴는 아코디언(› 화살표가 90° 회전).
- **Language toggle:** 테두리 상자 안 두 칸, 선택된 칸은 로고 파랑 면.

### Active Project Banner (signature)
홈의 진행 중 프로젝트 배너. 작업대 회색 면에 위쪽만 2px 로고 파랑 선, 오른쪽 위 모서리에서 파란 빛이 번져. 안쪽 여백 48px 40px(모바일 32px 24px), 표지가 있으면 글/표지 2열(표지 최대 420px).

### Scroll Reveal (signature motion)
팀 소개와 팀 역사의 섹션은 화면에 들어오면 아래에서 떠올라(팀 소개 32px·0.7초, 팀 역사 0.5초, easeOut). 팀 소개는 다시 들어올 때마다 반복되고, 팀 역사는 한 번만 나와. 팀 소개 사진은 액자 안에서 스크롤에 따라 ±8% 천천히 움직여. 모션 줄이기 설정이면 전부 처음부터 보인 상태로 멈춰 있어.

## Do's and Don'ts

### Do:
- **Do** 색은 `styles/theme.css` 토큰으로만 쓰고, 새 조합은 대비 검사(`npm run check:contrast`)를 통과시켜.
- **Do** 로고 파랑은 버튼·칩·뱃지·배너 윗선 같은 면에만, 그 위 글자는 흰색.
- **Do** 깊이는 면 밝기 한 단계와 1px 테두리 색 변화로 표현해.
- **Do** 상태 전환은 0.15초(패널은 0.2초)로 짧게, `prefers-reduced-motion`이면 끄기.
- **Do** 터치 대상은 최소 44px.
- **Do** 로고 교체는 `lib/config/site.js`에서만.

### Don't:
- **Don't** 로고 파랑을 검은 바탕 위 글자색으로 쓰지 마 (대비 2.87).
- **Don't** 카드나 패널에 그림자를 넣지 마.
- **Don't** CSS에 색 값을 직접 적지 마.
- **Don't** 파란 빛(Blue Glow)을 글자 뒤 배경으로 쓰지 마.
