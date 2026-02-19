import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

const ORDERS_SELECT =
  "id, order_number, customer_name, phone_number, status, origin, total, created_at, shipping_date, shipping_fee, notes, internal_notes, order_items (product_id, product_name, quantity, unit_price, line_total)"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const pageParam = url.searchParams.get("page")
  const pageSizeParam = url.searchParams.get("pageSize")
  const originParam = url.searchParams.get("origin")

  const isPaginated = pageParam !== null || pageSizeParam !== null || originParam !== null
  const page = Math.max(1, Number(pageParam ?? "1") || 1)
  const pageSize = Math.min(100, Math.max(1, Number(pageSizeParam ?? "8") || 8))
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabaseAdmin
    .from("orders")
    .select(ORDERS_SELECT, isPaginated ? { count: "exact" } : undefined)

  if (originParam === "pos") {
    query = query.eq("origin", "pos")
  } else if (originParam === "manual") {
    query = query.eq("origin", "manual")
  } else if (originParam === "web") {
    query = query.or("origin.is.null,origin.eq.ecommerce")
  }

  query = query.order("created_at", { ascending: false })

  if (isPaginated) {
    query = query.range(from, to)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }

  if (!isPaginated) {
    return NextResponse.json({ orders: data ?? [] })
  }

  const total = Number(count ?? 0)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return NextResponse.json({
    orders: data ?? [],
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  })
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, customerName, phoneNumber, shippingFee, items, status, internalNotes } = body ?? {}

    if (!id) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 })
    }

    const updatePayload: Record<string, any> = {}
    if (typeof customerName === "string") updatePayload.customer_name = customerName
    if (typeof phoneNumber === "string") updatePayload.phone_number = phoneNumber
    if (typeof status === "string") updatePayload.status = status
    if (typeof shippingFee === "number" && !Number.isNaN(shippingFee)) {
      updatePayload.shipping_fee = shippingFee
    }
    if (typeof internalNotes === "string") {
      updatePayload.internal_notes = internalNotes.trim() || null
    } else if (internalNotes === null) {
      updatePayload.internal_notes = null
    }

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

      let effectiveShippingFee = 0
      if (typeof shippingFee === "number" && !Number.isNaN(shippingFee)) {
        effectiveShippingFee = shippingFee
      } else {
        const { data: existingOrder } = await supabaseAdmin
          .from("orders")
          .select("shipping_fee")
          .eq("id", id)
          .single()
        effectiveShippingFee = Number(existingOrder?.shipping_fee ?? 0)
      }

      const { error: totalError } = await supabaseAdmin
        .from("orders")
        .update({ total: subtotal + effectiveShippingFee })
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
