-- Add manual origin for orders
-- Run this in Supabase SQL Editor

alter table public.orders drop constraint if exists orders_origin_check;

alter table public.orders
  add constraint orders_origin_check
  check (origin in ('ecommerce', 'pos', 'manual'));
