-- generate_review_id() 버그 수정: PL/pgSQL 변수명이 review_id_counters.day_key 컬럼명과 겹쳐서
-- "column reference day_key is ambiguous" 에러가 발생하던 문제를 변수명 접두사(v_)로 해결.
-- 실행 방법: Supabase 대시보드 SQL Editor에서 전체 실행 (테이블은 그대로 두고 함수만 재정의)

create or replace function public.generate_review_id()
returns text as $$
declare
  v_day_key text := to_char(now(), 'YYYYMMDD');
  v_next_seq integer;
begin
  insert into public.review_id_counters(day_key, last_seq)
    values (v_day_key, 1)
    on conflict (day_key) do update set last_seq = review_id_counters.last_seq + 1
    returning last_seq into v_next_seq;

  return v_day_key || lpad(v_next_seq::text, 5, '0');
end;
$$ language plpgsql security definer;
