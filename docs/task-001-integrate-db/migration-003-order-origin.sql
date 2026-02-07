-- Add order origin (ecommerce | pos)
-- Run this in Supabase SQL Editor

alter table public.orders
  add column if not exists origin text not null default 'ecommerce';

alter table public.orders drop constraint if exists orders_origin_check;

alter table public.orders
  add constraint orders_origin_check
  check (origin in ('ecommerce', 'pos'));
