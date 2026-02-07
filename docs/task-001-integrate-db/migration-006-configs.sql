create table if not exists public.configs (
  id int primary key default 1,
  shipping_fee integer not null default 120,
  closed_dates date[] not null default '{}',
  updated_at timestamptz not null default now()
);

insert into public.configs (id)
values (1)
on conflict (id) do nothing;
