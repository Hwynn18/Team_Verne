# 스폰서 문의 처리 상태 매뉴얼

스폰서 문의마다 처리 상태를 적어두는 방법이다. 관리자 페이지는 따로 없고 Supabase 대시보드에서 직접 본다.

## 상태 값

| 값 | 뜻 | 언제 바꾸나 |
|---|---|---|
| `new` | 새 문의 | 바꿀 필요 없음. 문의가 들어오면 자동으로 이 값 |
| `in_progress` | 처리 중 | 답장을 보냈거나 팀 안에서 논의 중일 때 |
| `done` | 완료 | 답장이 끝났거나, 거절·스팸 등으로 더 할 일이 없을 때 |

- 이 세 값 말고는 저장이 안 된다. 오타(`Done`, `done ` 등)를 넣으면 DB가 거부한다.
- 웹사이트 화면에는 상태가 어디에도 보이지 않는다. 팀 내부 기록용이다.

## 문의 확인하고 상태 바꾸기 (대시보드)

1. Supabase 대시보드 → 프로젝트 선택 → **Table Editor** → `sponsorship_inquiries`
2. `created_at`으로 최신순 정렬해서 새 문의를 본다. 새 문의가 들어오면 팀 알림 메일도 같이 온다.
3. 처리할 문의 행의 `status` 칸을 눌러 `in_progress` 또는 `done`으로 바꾸고 저장한다.
4. 아직 처리 안 한 문의만 보려면 `status`가 `new`인 행으로 필터를 건다.

> 대시보드 버튼·메뉴 이름은 Supabase 화면 개편에 따라 조금 다를 수 있다.

## SQL로 한 번에 보기·바꾸기 (SQL Editor)

처리 안 한 문의 보기:

```sql
select created_at, name, email, message
from public.sponsorship_inquiries
where status = 'new'
order by created_at desc;
```

상태별 개수:

```sql
select status, count(*) from public.sponsorship_inquiries group by status;
```

특정 문의를 완료로 바꾸기 (`<문의 id>`는 Table Editor의 `id` 칸 값):

```sql
update public.sponsorship_inquiries set status = 'done' where id = '<문의 id>';
```

> `update`는 `where`를 빼면 모든 문의가 바뀐다. 실행 전에 `where`가 있는지 꼭 확인한다.

## 알아둘 것

- 문의 내용에는 이름·이메일 같은 개인정보가 있다. 화면 캡처를 팀 밖에 공유하지 않는다.
- 이 테이블은 관리자 키로만 접근된다. 웹사이트 방문자는 읽을 수 없다.
- 메모 칸은 없다. 필요해지면 `note` 칸 추가를 요청하면 된다(SQL 한 줄, 코드 수정 없음).
- 칸을 만든 SQL: `docs/sql/006_sponsorship_inquiry_status.sql`
