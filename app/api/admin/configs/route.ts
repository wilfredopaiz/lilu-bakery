import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("configs")
    .select("id, shipping_fee, closed_dates, updated_at")
    .eq("id", 1)
    .single()

  if (error) {
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 })
  }

  return NextResponse.json({ config: data })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { shippingFee, closedDates } = body ?? {}

  const updates: Record<string, any> = { updated_at: new Date().toISOString() }
  if (typeof shippingFee === "number" && !Number.isNaN(shippingFee)) {
    updates.shipping_fee = shippingFee
  }
  if (Array.isArray(closedDates)) {
    updates.closed_dates = closedDates
  }

  const { data, error } = await supabaseAdmin
    .from("configs")
    .update(updates)
    .eq("id", 1)
    .select("id, shipping_fee, closed_dates, updated_at")
    .single()

  if (error) {
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 })
  }

  return NextResponse.json({ config: data })
}
