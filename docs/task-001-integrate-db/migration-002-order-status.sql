-- Add new order statuses: abandoned, cancelled
-- Run this in Supabase SQL Editor

alter table public.orders drop constraint if exists orders_status_check;

alter table public.orders
  add constraint orders_status_check
  check (status in ('pending', 'paid', 'abandoned', 'cancelled'));
