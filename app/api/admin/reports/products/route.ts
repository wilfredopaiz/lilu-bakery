import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

type AggregatedRow = {
  productId: string
  productName: string
  productCategory: "cookies" | "brownies" | "unknown"
  ecommerceQty: number
  ecommerceRevenue: number
  posQty: number
  posRevenue: number
  manualQty: number
  manualRevenue: number
  totalQty: number
  totalRevenue: number
}

function toDayStartIso(date: string) {
  return new Date(`${date}T00:00:00.000Z`).toISOString()
}

function toDayEndIso(date: string) {
  return new Date(`${date}T23:59:59.999Z`).toISOString()
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const startDate = url.searchParams.get("startDate")
  const endDate = url.searchParams.get("endDate")

  if (!startDate || !endDate) {
    return NextResponse.json({ error: "startDate and endDate are required" }, { status: 400 })
  }

  const startIso = toDayStartIso(startDate)
  const endIso = toDayEndIso(endDate)

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id, origin, order_items (product_id, product_name, quantity, line_total)"
    )
    .in("status", ["paid", "completed"])
    .gte("created_at", startIso)
    .lte("created_at", endIso)

  if (error) {
    return NextResponse.json({ error: "Failed to fetch products report" }, { status: 500 })
  }

  const byProduct = new Map<string, AggregatedRow>()

  for (const order of data ?? []) {
    const origin = order.origin === "pos" ? "pos" : order.origin === "manual" ? "manual" : "ecommerce"

    for (const item of order.order_items ?? []) {
      const productId = item.product_id as string
      const productName = item.product_name as string
      const quantity = Number(item.quantity ?? 0)
      const revenue = Number(item.line_total ?? 0)
      const key = `${productId}::${productName}`

      if (!byProduct.has(key)) {
        byProduct.set(key, {
          productId,
          productName,
          productCategory: "unknown",
          ecommerceQty: 0,
          ecommerceRevenue: 0,
          posQty: 0,
          posRevenue: 0,
          manualQty: 0,
          manualRevenue: 0,
          totalQty: 0,
          totalRevenue: 0,
        })
      }

      const row = byProduct.get(key)!
      if (origin === "ecommerce") {
        row.ecommerceQty += quantity
        row.ecommerceRevenue += revenue
      } else if (origin === "pos") {
        row.posQty += quantity
        row.posRevenue += revenue
      } else {
        row.manualQty += quantity
        row.manualRevenue += revenue
      }
      row.totalQty += quantity
      row.totalRevenue += revenue
    }
  }

  const productIds = Array.from(
    new Set(
      Array.from(byProduct.values())
        .map((row) => row.productId)
        .filter(Boolean)
    )
  )

  if (productIds.length > 0) {
    const { data: productsData } = await supabaseAdmin
      .from("products")
      .select("id, category")
      .in("id", productIds)

    const categoryByProductId = new Map<string, "cookies" | "brownies">()
    for (const product of productsData ?? []) {
      if (product.category === "cookies" || product.category === "brownies") {
        categoryByProductId.set(product.id, product.category)
      }
    }

    byProduct.forEach((row) => {
      row.productCategory = categoryByProductId.get(row.productId) ?? "unknown"
    })
  }

  const rows = Array.from(byProduct.values()).sort((a, b) => b.totalRevenue - a.totalRevenue)
  const totals = rows.reduce(
    (acc, row) => {
      acc.ecommerceQty += row.ecommerceQty
      acc.ecommerceRevenue += row.ecommerceRevenue
      acc.posQty += row.posQty
      acc.posRevenue += row.posRevenue
      acc.manualQty += row.manualQty
      acc.manualRevenue += row.manualRevenue
      acc.totalQty += row.totalQty
      acc.totalRevenue += row.totalRevenue
      return acc
    },
    {
      ecommerceQty: 0,
      ecommerceRevenue: 0,
      posQty: 0,
      posRevenue: 0,
      manualQty: 0,
      manualRevenue: 0,
      totalQty: 0,
      totalRevenue: 0,
    }
  )

  return NextResponse.json({ rows, totals })
}
