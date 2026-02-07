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

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, customerName, phoneNumber, items, status } = body ?? {}

    if (!id) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 })
    }

    const updatePayload: Record<string, any> = {}
    if (typeof customerName === "string") updatePayload.customer_name = customerName
    if (typeof phoneNumber === "string") updatePayload.phone_number = phoneNumber
    if (typeof status === "string") updatePayload.status = status

    if (Object.keys(updatePayload).length > 0) {
      const { error: orderError } = await supabaseAdmin
        .from("orders")
        .update(updatePayload)
        .eq("id", id)

      if (orderError) {
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
      }
    }

    if (Array.isArray(items)) {
      const { error: deleteError } = await supabaseAdmin
        .from("order_items")
        .delete()
        .eq("order_id", id)

      if (deleteError) {
        return NextResponse.json({ error: "Failed to update order items" }, { status: 500 })
      }

      if (items.length > 0) {
        const orderItems = items.map((item) => ({
          order_id: id,
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          unit_price: item.price,
          line_total: item.price * item.quantity,
        }))

        const { error: insertError } = await supabaseAdmin.from("order_items").insert(orderItems)

        if (insertError) {
          return NextResponse.json({ error: "Failed to update order items" }, { status: 500 })
        }
      }

      const subtotal = items.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      )
      const { error: totalError } = await supabaseAdmin
        .from("orders")
        .update({ total: subtotal })
        .eq("id", id)

      if (totalError) {
        return NextResponse.json({ error: "Failed to update order total" }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
