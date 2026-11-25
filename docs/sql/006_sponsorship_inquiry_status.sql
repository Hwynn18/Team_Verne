-- 스폰서 문의 처리 상태. 대시보드에서 직접 바꾸는 칸이고 코드는 이 칸을 쓰지 않는다(저장 시 기본값 new).
-- 기존 문의 행도 new 로 채워진다. Supabase SQL Editor 에서 실행. 2026-11-25 작성.

alter table public.sponsorship_inquiries
  add column if not exists status text not null default 'new';

alter table public.sponsorship_inquiries drop constraint if exists sponsorship_inquiries_status_check;
alter table public.sponsorship_inquiries add constraint sponsorship_inquiries_status_check
  check (status in ('new', 'in_progress', 'done'));
