"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProductReportRow } from "@/lib/dashboard/services/reports"
import { formatPrice } from "@/lib/format-price"

function summarizeByCategory(rows: ProductReportRow[], category: "cookies" | "brownies") {
  return rows
    .filter((row) => row.productCategory === category)
    .reduce(
      (acc, row) => {
        acc.ecommerceRevenue += row.ecommerceRevenue
        acc.ecommerceQty += row.ecommerceQty
        acc.posRevenue += row.posRevenue
        acc.posQty += row.posQty
        acc.manualRevenue += row.manualRevenue
        acc.manualQty += row.manualQty
        return acc
      },
      {
        ecommerceRevenue: 0,
        ecommerceQty: 0,
        posRevenue: 0,
        posQty: 0,
        manualRevenue: 0,
        manualQty: 0,
      }
    )
}

function CategoryBlock(props: {
  title: string
  summary: {
    ecommerceRevenue: number
    ecommerceQty: number
    posRevenue: number
    posQty: number
    manualRevenue: number
    manualQty: number
  }
}) {
  const { title, summary } = props
  const totalRevenue = summary.ecommerceRevenue + summary.posRevenue + summary.manualRevenue
  const totalQty = summary.ecommerceQty + summary.posQty + summary.manualQty

  return (
    <div className="rounded-lg border border-border/60 p-4 space-y-2">
      <p className="text-sm font-semibold">{title}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Ecommerce</span>
        <span className="font-semibold text-green-700">{formatPrice(summary.ecommerceRevenue)} | {summary.ecommerceQty} und</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">POS</span>
        <span className="font-semibold text-green-700">{formatPrice(summary.posRevenue)} | {summary.posQty} und</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Manual</span>
        <span className="font-semibold text-green-700">{formatPrice(summary.manualRevenue)} | {summary.manualQty} und</span>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-2 mt-2">
        <span className="text-sm font-medium">Total {title}</span>
        <span className="font-bold text-green-700">{formatPrice(totalRevenue)} | {totalQty} und</span>
      </div>
    </div>
  )
}

export function ProductsReportSummary(props: { rows: ProductReportRow[] }) {
  const { rows } = props
  const brownies = summarizeByCategory(rows, "brownies")
  const cookies = summarizeByCategory(rows, "cookies")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen por canal y categoría</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        <CategoryBlock title="Brownies" summary={brownies} />
        <CategoryBlock title="Galletas" summary={cookies} />
      </CardContent>
    </Card>
  )
}
