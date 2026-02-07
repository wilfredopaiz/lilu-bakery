-- Add product channels for ecommerce/pos
-- Run this in Supabase SQL Editor

alter table public.products
  add column if not exists channels text[] not null default '{ecommerce,pos}';

alter table public.products drop constraint if exists products_channels_check;

alter table public.products
  add constraint products_channels_check
  check (channels <@ array['ecommerce','pos']::text[]);
