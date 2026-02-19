-- Add internal notes field to orders
-- Run this in Supabase SQL Editor

alter table public.orders
  add column if not exists internal_notes text;
