alter table public.products
  add column if not exists is_seasonal boolean not null default false,
  add column if not exists season_key text;
