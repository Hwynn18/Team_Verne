-- 프로젝트별 만든 사람(멤버) 연결. project_departments 와 같은 구조.
-- features/projects/projectQueries.js 가 이 테이블을 같이 조회하므로 코드 배포 전에 먼저 실행한다.
-- Supabase SQL Editor 에서 실행. 2026-11-16 작성.

create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  primary key (project_id, member_id)
);

alter table public.project_members enable row level security;

-- 공개 테이블 규칙: anon 은 SELECT 만
revoke all on public.project_members from anon, authenticated;
grant select on public.project_members to anon;

drop policy if exists "project_members public read" on public.project_members;
create policy "project_members public read" on public.project_members
  for select to anon using (true);
