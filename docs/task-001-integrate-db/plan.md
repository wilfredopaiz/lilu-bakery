# Plan: Supabase Auth + Data Model Integration

## Review Notes (Current State)
- Products are static in `lib/products.ts` and used by `app/page.tsx`, `app/category/[slug]/page.tsx`, and `app/product/[id]/page.tsx`.
- Orders are mock data in `lib/mock-orders.ts`, only used by `app/dashboard/page.tsx`.
- Cart is client-only in `components/cart-provider.tsx` (localStorage).
- Checkout is client-only in `app/checkout/page.tsx`, generates an order number and redirects without persistence.
- Login is a client-only mock that redirects to `/dashboard`.

## Goals
- Add Supabase authentication using OAuth (Facebook only).
- Add Supabase-backed tables for products and orders.
- Fetch products and orders from Supabase and show them in the app.
- Keep guest checkout and allow order creation without login.

## Environment Setup (User will add manually)
- Add Supabase connection string(s) to `.env` and `.env.local`.
- Provide a list of required env vars to the user (no values committed).
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_URL` (optional if same as `NEXT_PUBLIC_SUPABASE_URL`)

## Table Creation Instructions
1. Open Supabase Dashboard > SQL Editor.
1. Create a new query and paste the contents of `docs/task-001-integrate-db/migration.sql`.
1. Run the query to create tables, indexes, and RLS policies.
1. (Optional) Re-run only the seed section to update products if needed.

## Plan
1. Supabase tables integration
1. Create `products`, `orders`, and `order_items` tables in Supabase with required columns to match current UI usage (name, description, price, category, image, featured for products; customer info, status, totals for orders).
1. Add foreign keys and indexes (orders -> users; order_items -> orders/products).
1. Define RLS policies:
1. Public read for `products`.
1. Authenticated users can read their own `orders` and `order_items`.
1. Inserts for guest checkout will be done server-side with service role (no public insert policy).
1. Seed products to match `lib/products.ts` so the current UI renders the same data.

2. Supabase OAuth
1. Enable OAuth provider in Supabase project settings (Facebook).
1. Add OAuth callback URL(s) matching the Next.js routes.
1. Add Supabase client utilities (server/client) and session helpers.
1. Replace mock login page with Supabase OAuth sign-in flow.
1. Protect `/dashboard` (and any order history views) to require auth.

3. Fetch products and orders from Supabase
1. Replace `lib/products.ts` usage with Supabase queries in:
1. `app/page.tsx` (featured products)
1. `app/category/[slug]/page.tsx` (category list)
1. `app/product/[id]/page.tsx` (product detail + related products)
1. Update cart add-to-cart to use Supabase product data types (id, name, price, image).
1. Replace `lib/mock-orders.ts` usage in `app/dashboard/page.tsx` with Supabase query (user-scoped orders + order_items).
1. Update `app/checkout/page.tsx` to persist orders to Supabase before redirecting to confirmation.

## Deliverables
- Supabase schema and RLS policies documented in the repo.
- Updated Next.js code integrating Supabase auth and data access.
- `.env` variable list and setup notes.
- QA checklist for product browsing, login, checkout, and dashboard orders.

## Risks / Open Questions
- Whether orders should require auth at checkout (guest checkout confirmed).
- Admin product management scope for `/dashboard` (currently client-only CRUD).
- Payment flow (currently bank transfer UI only, no backend integration).
