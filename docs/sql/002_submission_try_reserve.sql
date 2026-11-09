-- IP 제출 제한: 확인과 기록을 한 번에 (lib/forms/spamGuard.js tryReserveSubmission 에서 호출)
-- 같은 scope + ip_hash 요청을 advisory lock 으로 줄 세워 동시 요청도 p_max 를 넘지 못한다.
-- 부작용(저장·메일)보다 먼저 호출한다. 보관 기간이 지난 기록도 같이 지운다.
-- Supabase SQL Editor 에서 실행. 2026-11-09 적용.

create index if not exists submission_log_scope_ip_created_idx
  on public.submission_log (scope, ip_hash, created_at);

create or replace function public.submission_try_reserve(
  p_scope text, p_ip_hash text, p_max int, p_window_seconds int, p_retention_seconds int
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_count int;
begin
  if p_max < 1 or p_window_seconds < 1 or p_retention_seconds < p_window_seconds then
    raise exception 'invalid limits';
  end if;

  -- 같은 범위·IP 요청끼리 줄 세운다 (트랜잭션이 끝나면 자동으로 풀림)
  perform pg_advisory_xact_lock(hashtextextended(p_scope || ':' || p_ip_hash, 0));

  select count(*) into v_count
    from public.submission_log
   where scope = p_scope
     and ip_hash = p_ip_hash
     and created_at >= now() - make_interval(secs => p_window_seconds);

  if v_count >= p_max then
    return false;
  end if;

  insert into public.submission_log (scope, ip_hash) values (p_scope, p_ip_hash);

  delete from public.submission_log
   where created_at < now() - make_interval(secs => p_retention_seconds);

  return true;
end;
$$;

-- anon 이 부르면 남의 한도를 일부러 소진시킬 수 있으므로 막는다
revoke execute on function public.submission_try_reserve(text, text, int, int, int) from public, anon, authenticated;
grant execute on function public.submission_try_reserve(text, text, int, int, int) to service_role;

-- 확인: false 여야 함
-- select has_function_privilege('anon', 'public.submission_try_reserve(text,text,int,int,int)', 'execute');
