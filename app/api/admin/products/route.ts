import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { randomUUID } from "crypto"

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }

  return NextResponse.json({ products: data ?? [] })
}

export async function POST(request: Request) {
  const body = await request.json()

  const { name, description, price, category, image, featured = false, channels, isSeasonal, seasonKey } = body ?? {}

  if (!name || !description || !price || !category || !image) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  if (!Array.isArray(channels)) {
    return NextResponse.json({ error: "Missing channels" }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      id: randomUUID(),
      name,
      description,
      price,
      category,
      image,
      featured,
      channels,
      is_seasonal: Boolean(isSeasonal),
      season_key: isSeasonal ? seasonKey ?? "valentin" : null,
    })
    .select("*")
    .single()

  if (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }

  return NextResponse.json({ product: data })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, isSeasonal, seasonKey, ...updates } = body ?? {}

  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 })
  }

  if (typeof isSeasonal === "boolean") {
    updates.is_seasonal = isSeasonal
    updates.season_key = isSeasonal ? seasonKey ?? "valentin" : null
  } else if (typeof seasonKey === "string") {
    updates.season_key = seasonKey
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single()

  if (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }

  return NextResponse.json({ product: data })
}

export async function DELETE(request: Request) {
  const body = await request.json()
  const { id } = body ?? {}

  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
