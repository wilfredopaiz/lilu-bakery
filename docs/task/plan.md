# Plan: Supabase Auth + Data Model Integration

## Goals
- Add Supabase authentication for users.
- Add Supabase-backed tables for products and orders.
- Wire the Next.js store to read products and create orders securely.

## Scope Assumptions (to validate)
- Next.js App Router project with existing product listing and cart flow.
- Products should be public read; orders should be user-scoped.
- Supabase is the chosen backend for auth + database.

## High-Level Steps
1. Review current codebase structure, data flow, and cart/order creation points.
2. Design Supabase schema (products, orders, order_items) and RLS policies.
3. Add Supabase client setup for server and client contexts.
4. Implement auth flow (sign in/up, session handling, protected routes).
5. Replace product data source with Supabase queries.
6. Create order submission path and persist orders to Supabase.
7. Add server-side validation and error handling for order creation.
8. Update UI states and any required components.
9. Add environment variables and deployment notes.
10. Validate flows and note tests or manual QA steps.

## Deliverables
- Supabase schema + RLS policy definitions (documented).
- Updated Next.js code integrating Supabase auth and data access.
- Environment variable list and setup instructions.
- Simple QA checklist for key flows.

## Risks / Open Questions
- Exact existing cart/order flow and where to hook order persistence.
- Whether admin product management UI is required (out of scope unless specified).
- Payment integration expectations (assumed out of scope).
