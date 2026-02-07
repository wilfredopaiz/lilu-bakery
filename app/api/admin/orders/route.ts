import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id, order_number, customer_name, phone_number, status, origin, total, created_at, order_items (product_id, product_name, quantity, unit_price, line_total)"
    )
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }

  return NextResponse.json({ orders: data ?? [] })
}
