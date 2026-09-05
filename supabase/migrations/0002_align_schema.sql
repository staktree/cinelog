-- 기존에 다른 이름으로 생성되어 있던 reviews / review_id_counters / next_review_sequence를
-- 제거하고, supabase/migrations/0001_init.sql 기준 스키마로 다시 생성한다.
-- 실행 전 확인: reviews 테이블에 데이터가 없는 상태(빈 배열)임을 확인했음 - 삭제해도 데이터 손실 없음.
-- 실행 방법: Supabase 대시보드 SQL Editor에서 전체 실행

-- 1. 기존 객체 제거 (이번 프로젝트에서 다른 이름/컬럼으로 미리 만들어져 있던 것들)
drop function if exists public.next_review_sequence();
drop table if exists public.reviews cascade;
drop table if exists public.review_id_counters cascade;

-- 2. reviews 테이블 (0001_init.sql과 동일)
create table public.reviews (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) <= 30),
  rating numeric(2,1) not null check (rating >= 1 and rating <= 5 and rating * 2 = floor(rating * 2)),
  content text not null check (char_length(content) <= 2000),
  summary text not null check (char_length(summary) <= 100),
  poster_image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reviews_user_id_created_at_idx
  on public.reviews (user_id, created_at desc);

alter table public.reviews enable row level security;

create policy "select_own_reviews" on public.reviews
  for select using (auth.uid() = user_id);

create policy "insert_own_reviews" on public.reviews
  for insert with check (auth.uid() = user_id);

create policy "update_own_reviews" on public.reviews
  for update using (auth.uid() = user_id);

create policy "delete_own_reviews" on public.reviews
  for delete using (auth.uid() = user_id);

-- 3. updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger touch_updated_at
  before update on public.reviews
  for each row
  execute function public.set_updated_at();

-- 4. 감상평ID(YYYYMMDD00001) 원자적 발번
create table public.review_id_counters (
  day_key text primary key,
  last_seq integer not null default 0
);

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

-- 5. Storage RLS 정책 (review-posters 버킷은 대시보드 Storage 메뉴에서 Private으로 직접 생성해야 한다)
drop policy if exists "own poster rw" on storage.objects;
create policy "own poster rw" on storage.objects
  for all
  using (bucket_id = 'review-posters' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'review-posters' and auth.uid()::text = (storage.foldername(name))[1]);
