import { NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { sendOrderCreatedNotification } from "@/lib/notifications/telegram"

const orderItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
})

const orderSchema = z.object({
  customerName: z.string().min(1),
  phoneNumber: z.string().min(1),
  paymentMethod: z.string().min(1),
  currency: z.string().min(1).default("HNL"),
  shippingFee: z.number().nonnegative().default(120),
  shippingDate: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const { customerName, phoneNumber, paymentMethod, currency, shippingFee, shippingDate, notes, items } = parsed.data
    const orderNumber = `LB-${Date.now().toString(36).toUpperCase()}`

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const total = subtotal + shippingFee

    let userId: string | null = null
    const authHeader = request.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice("Bearer ".length)
      const { data } = await supabaseAdmin.auth.getUser(token)
      if (data.user) {
        userId = data.user.id
      }
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: userId,
        customer_name: customerName,
        phone_number: phoneNumber,
        status: "pending",
        payment_method: paymentMethod,
        total,
        currency,
        origin: "ecommerce",
        shipping_date: shippingDate,
        shipping_fee: shippingFee,
        notes: notes?.trim() || null,
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

    try {
      const notificationResult = await sendOrderCreatedNotification({
        orderNumber: order.order_number,
        origin: "ecommerce",
        customerName,
        phoneNumber,
        status: "pending",
        currency,
        total,
        shippingFee,
        shippingDate,
        notes: notes?.trim() || null,
        createdAt: new Date().toISOString(),
        items: items.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          lineTotal: item.price * item.quantity,
        })),
      })

      if (notificationResult.failureCount > 0) {
        console.error("[telegram-notify] Partial/failed delivery", {
          orderNumber: order.order_number,
          successCount: notificationResult.successCount,
          failureCount: notificationResult.failureCount,
          failures: notificationResult.failures.slice(0, 5),
        })
      }
    } catch (error) {
      console.error("[telegram-notify] Unexpected error in notification flow", {
        orderNumber: order.order_number,
        error: error instanceof Error ? error.message : String(error),
      })
    }

    return NextResponse.json({
      orderNumber: order.order_number,
      total: order.total,
    })
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
