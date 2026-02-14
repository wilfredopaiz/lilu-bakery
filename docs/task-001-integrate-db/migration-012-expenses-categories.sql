-- Add hardcoded categories for expenses
-- Run this in Supabase SQL Editor

alter table public.expenses
  add column if not exists category text;

-- Normalize legacy values (if any) to english keys
update public.expenses
set category = case
  when category in ('publicidad', 'advertising') then 'advertising'
  when category in ('insumos_reposteria_especializada', 'specialized_baking_supplies') then 'specialized_baking_supplies'
  when category in ('materia_prima', 'raw_materials') then 'raw_materials'
  when category in ('shipping', 'gastos_envio') then 'shipping'
  else category
end;

update public.expenses
set category = coalesce(category, 'raw_materials');

alter table public.expenses
  alter column category set not null;

alter table public.expenses drop constraint if exists expenses_category_check;

alter table public.expenses
  add constraint expenses_category_check
  check (
    category in (
      'advertising',
      'specialized_baking_supplies',
      'raw_materials',
      'shipping'
    )
  );

create index if not exists expenses_category_idx on public.expenses(category);
