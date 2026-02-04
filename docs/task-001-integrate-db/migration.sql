-- Supabase schema + RLS for bakery store
-- Run this in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id text primary key,
  name text not null,
  description text not null,
  price double precision not null,
  category text not null check (category in ('cookies', 'brownies')),
  image text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid null references auth.users(id) on delete set null,
  customer_name text not null,
  phone_number text not null,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  payment_method text not null default 'bank-transfer',
  total double precision not null,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price double precision not null,
  line_total double precision not null,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category);
create index if not exists products_featured_idx on public.products(featured);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists order_items_product_id_idx on public.order_items(product_id);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Products: public read-only
create policy "products_select_public" on public.products
  for select using (true);

-- Orders: authenticated users can manage their own orders
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "orders_update_own" on public.orders
  for update using (auth.uid() = user_id);

create policy "orders_delete_own" on public.orders
  for delete using (auth.uid() = user_id);

-- Order items: authenticated users can manage items for their own orders
create policy "order_items_select_own" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

create policy "order_items_insert_own" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

create policy "order_items_update_own" on public.order_items
  for update using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

create policy "order_items_delete_own" on public.order_items
  for delete using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

-- Seed products (safe to re-run)
insert into public.products (id, name, description, price, category, image, featured)
values
  ('1', 'Classic Chocolate Chip', 'Our signature cookie with premium chocolate chips and a perfect golden crisp', 12.99, 'cookies', '/chocolate-chip-cookies.png', true),
  ('2', 'Double Fudge Brownie', 'Rich, dense, and utterly chocolatey with a fudgy center', 14.99, 'brownies', '/fudge-brownies.jpg', true),
  ('3', 'Pink Sugar Cookies', 'Soft and buttery cookies with pink vanilla icing and rainbow sprinkles', 11.99, 'cookies', '/pink-sugar-cookies.jpg', true),
  ('4', 'Salted Caramel Brownie', 'Gooey brownies swirled with caramel and topped with sea salt', 15.99, 'brownies', '/salted-caramel-brownies.jpg', true),
  ('5', 'Oatmeal Raisin', 'Hearty oats, plump raisins, and warm cinnamon in every bite', 10.99, 'cookies', '/oatmeal-raisin-cookies.png', false),
  ('6', 'White Chocolate Macadamia', 'Buttery cookies loaded with white chocolate and macadamia nuts', 13.99, 'cookies', '/white-chocolate-macadamia-cookies.jpg', false),
  ('7', 'Peanut Butter Cup Brownie', 'Decadent brownies studded with peanut butter cups', 15.99, 'brownies', '/peanut-butter-cup-brownies.jpg', false),
  ('8', 'Lemon Lavender Cookie', 'Delicate citrus cookies with a hint of lavender', 12.99, 'cookies', '/lemon-lavender-cookies.jpg', false),
  ('9', 'Triple Chocolate Brownie', 'Dark, milk, and white chocolate in one indulgent treat', 16.99, 'brownies', '/triple-chocolate-brownies.jpg', false),
  ('10', 'Snickerdoodle', 'Soft cinnamon sugar cookies with a delightful chewy texture', 11.99, 'cookies', '/snickerdoodle-cookies.png', false),
  ('11', 'Raspberry Swirl Brownie', 'Fudgy brownies with tangy raspberry swirls', 15.99, 'brownies', '/raspberry-swirl-brownies.jpg', false),
  ('12', 'Matcha White Chocolate', 'Earthy matcha cookies with sweet white chocolate chunks', 13.99, 'cookies', '/matcha-white-chocolate-cookies.jpg', false)
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  category = excluded.category,
  image = excluded.image,
  featured = excluded.featured;
