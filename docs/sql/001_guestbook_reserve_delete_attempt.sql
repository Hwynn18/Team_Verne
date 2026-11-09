-- 방명록 삭제 시도를 원자적으로 예약한다 (features/guestbook/actions.js deleteEntry 에서 호출)
-- 행 잠금으로 동시 요청을 줄 세우고, 비밀번호 확인 전에 시도 횟수를 올린다.
-- p_max 번 시도하면 p_lock_seconds 동안 잠기고, 잠금이 끝나면 0부터 다시 센다.
-- Supabase SQL Editor 에서 실행. 2026-11-09 적용.

alter table public.guestbook_entries
  add column if not exists delete_locked_until timestamptz;

create or replace function public.guestbook_reserve_delete_attempt(
  p_id uuid, p_max int, p_lock_seconds int
)
returns table (status text, password_hash text)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_row public.guestbook_entries%rowtype;
  v_attempts int;
begin
  if p_max < 1 or p_lock_seconds < 1 then
    raise exception 'invalid limits';
  end if;

  -- 같은 글에 대한 동시 요청을 줄 세운다
  select * into v_row from public.guestbook_entries where id = p_id for update;
  if not found then
    return query select 'notFound'::text, null::text;
    return;
  end if;

  if v_row.delete_locked_until is not null and v_row.delete_locked_until > now() then
    return query select 'locked'::text, null::text;
    return;
  end if;

  -- 잠금이 끝났으면 0부터 다시 센다
  v_attempts := case when v_row.delete_locked_until is not null then 1
                     else v_row.delete_failures + 1 end;

  update public.guestbook_entries
     set delete_failures = v_attempts,
         delete_locked_until = case when v_attempts >= p_max
                                    then now() + make_interval(secs => p_lock_seconds)
                                    else null end
   where id = p_id;

  return query select 'allowed'::text, v_row.password_hash;
end;
$$;

-- password_hash 를 돌려주므로 anon 이 못 부르게 막는다 (Supabase 는 기본으로 anon 에 열려 있음)
revoke execute on function public.guestbook_reserve_delete_attempt(uuid, int, int) from public, anon, authenticated;
grant execute on function public.guestbook_reserve_delete_attempt(uuid, int, int) to service_role;

-- 확인: false 여야 함
-- select has_function_privilege('anon', 'public.guestbook_reserve_delete_attempt(uuid,int,int)', 'execute');
