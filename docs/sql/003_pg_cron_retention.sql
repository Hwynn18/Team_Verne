-- 동의 문구의 "IP 24시간 후 자동 삭제" 약속을 제출이 없을 때도 지키기 위한 스케줄
-- 시간은 GMT 기준. Supabase SQL Editor 에서 실행. 2026-11-09 적용.

create extension if not exists pg_cron;

-- 매시 정각에 24시간 지난 IP 해시 기록 삭제
select cron.schedule(
  'submission-log-retention',
  '0 * * * *',
  $$ delete from public.submission_log where created_at < now() - interval '24 hours' $$
);

-- pg_cron 실행 기록은 기본으로 안 지워지므로 7일 지난 것 정리
select cron.schedule(
  'job-run-details-cleanup',
  '0 0 * * *',
  $$ delete from cron.job_run_details where end_time < now() - interval '7 days' $$
);

-- 확인
-- select jobname, schedule, command from cron.job;
