-- Supabase 초기 스키마: 감상평(reviews) 테이블, ID 발번 함수, RLS 정책, Storage 정책
-- 실행 방법: Supabase 대시보드 SQL Editor에서 전체 실행 (또는 supabase db push)
-- 참고: SDD/감상평작성기능명세.md, SDD/감상평조회기능명세.md, SDD/감상평수정기능명세.md

-- 1. reviews 테이블
create table if not exists public.reviews (
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

create index if not exists reviews_user_id_created_at_idx
  on public.reviews (user_id, created_at desc);

alter table public.reviews enable row level security;

drop policy if exists "select_own_reviews" on public.reviews;
create policy "select_own_reviews" on public.reviews
  for select using (auth.uid() = user_id);

drop policy if exists "insert_own_reviews" on public.reviews;
create policy "insert_own_reviews" on public.reviews
  for insert with check (auth.uid() = user_id);

drop policy if exists "update_own_reviews" on public.reviews;
create policy "update_own_reviews" on public.reviews
  for update using (auth.uid() = user_id);

drop policy if exists "delete_own_reviews" on public.reviews;
create policy "delete_own_reviews" on public.reviews
  for delete using (auth.uid() = user_id);

-- 2. updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists touch_updated_at on public.reviews;
create trigger touch_updated_at
  before update on public.reviews
  for each row
  execute function public.set_updated_at();

-- 3. 감상평ID(YYYYMMDD00001) 원자적 발번
-- SDD/감상평작성기능명세.md 4~6번 규칙: 날짜 8자리 + 당일 시퀀스 5자리, 당일 최초 생성 시 00001
create table if not exists public.review_id_counters (
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

-- 4. Storage: review-posters 버킷은 대시보드(Storage 메뉴)에서 Private으로 직접 생성해야 한다.
-- 경로 규칙: {user_id}/{reviewId}.{확장자}
drop policy if exists "own poster rw" on storage.objects;
create policy "own poster rw" on storage.objects
  for all
  using (bucket_id = 'review-posters' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'review-posters' and auth.uid()::text = (storage.foldername(name))[1]);
