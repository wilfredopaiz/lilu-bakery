export type ProductReportRow = {
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

export type ProductReportTotals = {
  ecommerceQty: number
  ecommerceRevenue: number
  posQty: number
  posRevenue: number
  manualQty: number
  manualRevenue: number
  totalQty: number
  totalRevenue: number
}

export async function fetchProductReport(input: { startDate: string; endDate: string }) {
  const params = new URLSearchParams({
    startDate: input.startDate,
    endDate: input.endDate,
  })
  const response = await fetch(`/api/admin/reports/products?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch products report")
  }
  const payload = await response.json()
  return {
    rows: (payload.rows ?? []) as ProductReportRow[],
    totals: (payload.totals ?? {
      ecommerceQty: 0,
      ecommerceRevenue: 0,
      posQty: 0,
      posRevenue: 0,
      manualQty: 0,
      manualRevenue: 0,
      totalQty: 0,
      totalRevenue: 0,
    }) as ProductReportTotals,
  }
}
