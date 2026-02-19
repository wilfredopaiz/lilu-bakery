import { NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase/admin"

const orderItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
})

const orderSchema = z.object({
  customerName: z.string().optional(),
  phoneNumber: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.string().min(1).default("pos"),
  currency: z.string().min(1).default("HNL"),
  origin: z.enum(["pos", "manual"]).default("pos"),
  items: z.array(orderItemSchema).min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const {
      customerName,
      phoneNumber,
      notes,
      paymentMethod,
      currency,
      origin,
      items,
    } = parsed.data
    const orderNumberPrefix = origin === "manual" ? "MAN" : "POS"
    const orderNumber = `${orderNumberPrefix}-${Date.now().toString(36).toUpperCase()}`
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: null,
        customer_name: customerName?.trim() || "Cliente POS",
        phone_number: phoneNumber?.trim() || "0",
        status: "paid",
        payment_method: paymentMethod,
        total,
        shipping_fee: 0,
        currency,
        origin,
        notes: null,
        internal_notes: notes?.trim() ? notes.trim() : null,
      })
      .select("id, order_number, total")
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      unit_price: item.price,
      line_total: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems)

    if (itemsError) {
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    return NextResponse.json({
      orderNumber: order.order_number,
      total: order.total,
    })
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
