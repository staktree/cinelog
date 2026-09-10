-- Supabase 마이그레이션: 감상평(reviews) 테이블 + 사용자별 RLS + 원자적 ID 발번
-- 참고: SDD/감상평작성기능명세.md, SDD/로그인기능명세.md
-- 실행 방법: Supabase 대시보드 > SQL Editor 에서 전체 실행

-- 1. 감상평 테이블
create table if not exists public.reviews (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) <= 30),
  rating numeric(2, 1) not null check (rating >= 1 and rating <= 5),
  content text not null check (char_length(content) <= 2000),
  one_liner text not null check (char_length(one_liner) <= 100),
  created_at date not null default current_date
);

create index if not exists reviews_user_id_idx on public.reviews (user_id);

alter table public.reviews enable row level security;

-- 감상평 조회/수정 기능명세: 본인이 작성한 감상평만 조회/수정 가능
create policy "select_own_reviews" on public.reviews
  for select using (auth.uid() = user_id);

create policy "insert_own_reviews" on public.reviews
  for insert with check (auth.uid() = user_id);

create policy "update_own_reviews" on public.reviews
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 2. 감상평ID 발번용 날짜별 원자적 카운터
-- (RLS로 본인 행만 보이는 상태에서는 클라이언트가 "당일 마지막 ID"를 정확히 알 수 없으므로,
--  전체 사용자 공통 순번을 DB에서 원자적으로 발번한다)
create table if not exists public.review_id_counters (
  date_prefix text primary key,
  last_sequence integer not null default 0
);

alter table public.review_id_counters enable row level security;
-- review_id_counters는 아래 next_review_sequence 함수(SECURITY DEFINER)를 통해서만 접근한다
-- (일반 사용자에게 부여된 select/insert/update 정책 없음 = 직접 접근 불가)

-- 3. 당일 마지막 순번 + 1을 원자적으로 발번하여 반환하는 함수
create or replace function public.next_review_sequence(p_date_prefix text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sequence integer;
begin
  insert into public.review_id_counters (date_prefix, last_sequence)
  values (p_date_prefix, 1)
  on conflict (date_prefix)
  do update set last_sequence = public.review_id_counters.last_sequence + 1
  returning last_sequence into v_sequence;

  return v_sequence;
end;
$$;

revoke all on function public.next_review_sequence(text) from public;
grant execute on function public.next_review_sequence(text) to authenticated;
