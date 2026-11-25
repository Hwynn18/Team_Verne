-- 프로젝트 상세 본문(마크다운, 다국어)과 기간.
-- features/projects/projectQueries.js 가 이 칸들을 같이 조회하므로 코드 배포 전에 먼저 실행한다.
-- Supabase SQL Editor 에서 실행. 2026-11-25 작성.

alter table public.projects
  add column if not exists body_ko text not null default '',
  add column if not exists body_en text not null default '',
  add column if not exists started_on date,
  add column if not exists ended_on date;

-- 대시보드에서 직접 입력하는 칸이라 DB에서 길이를 막는다
alter table public.projects drop constraint if exists projects_body_length;
alter table public.projects add constraint projects_body_length
  check (char_length(body_ko) <= 20000 and char_length(body_en) <= 20000);

-- 종료일은 시작일이 있을 때만, 시작일보다 앞설 수 없음
alter table public.projects drop constraint if exists projects_period_order;
alter table public.projects add constraint projects_period_order
  check (ended_on is null or (started_on is not null and ended_on >= started_on));
