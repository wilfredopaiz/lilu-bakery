import { NextResponse } from "next/server"
import { sendOrderCreatedNotification } from "@/lib/notifications/telegram"

export async function POST() {
  try {
    const now = new Date()
    const shippingDate = new Date(now)
    shippingDate.setDate(shippingDate.getDate() + 1)

    const payload = {
      orderNumber: `TEST-${Date.now().toString(36).toUpperCase()}`,
      origin: "ecommerce" as const,
      customerName: "Cliente Prueba",
      phoneNumber: "9999-9999",
      status: "pending",
      currency: "HNL",
      total: 320,
      shippingFee: 120,
      shippingDate: shippingDate.toISOString().slice(0, 10),
      notes: "Esta es una notificacion de prueba desde /api/admin/test-telegram",
      createdAt: now.toISOString(),
      items: [
        { productName: "Cookie Chocolate", quantity: 2, price: 100, lineTotal: 200 },
        { productName: "Brownie Fudge", quantity: 1, price: 120, lineTotal: 120 },
      ],
    }

    const result = await sendOrderCreatedNotification(payload)

    return NextResponse.json({
      ok: true,
      message: "Test notification processed",
      result,
      mockOrder: {
        orderNumber: payload.orderNumber,
        total: payload.total,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to send test notification",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
