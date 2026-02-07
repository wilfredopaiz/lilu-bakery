alter table public.orders
  add column if not exists shipping_date date;
