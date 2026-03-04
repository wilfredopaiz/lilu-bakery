"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS } from "@/lib/dashboard/services/expenses"
import { formatPrice } from "@/lib/format-price"

export function GeneralReport(props: {
  ecommerceSales: number
  posSales: number
  manualSales: number
  totalSales: number
  expenseByCategory: Array<{ category: (typeof EXPENSE_CATEGORIES)[number]; total: number }>
  shippingCosts: number
  totalOutflows: number
  netTotal: number
  isLoading: boolean
}) {
  const {
    ecommerceSales,
    posSales,
    manualSales,
    totalSales,
    expenseByCategory,
    shippingCosts,
    totalOutflows,
    netTotal,
    isLoading,
  } = props

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Ingresos (Ventas)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ventas Ecommerce</span>
              <span className="font-semibold text-green-700">{formatPrice(ecommerceSales)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ventas POS</span>
              <span className="font-semibold text-green-700">{formatPrice(posSales)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ventas Manuales</span>
              <span className="font-semibold text-green-700">{formatPrice(manualSales)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="text-sm font-medium">Total ingresos</span>
              <span className="font-bold text-green-700">{formatPrice(totalSales)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-700">Egresos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expenseByCategory.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{EXPENSE_CATEGORY_LABELS[item.category]}</span>
                <span className="font-semibold text-red-700">{formatPrice(item.total)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Costos de envio</span>
              <span className="font-semibold text-red-700">{formatPrice(shippingCosts)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="text-sm font-medium">Total egresos</span>
              <span className="font-bold text-red-700">{formatPrice(totalOutflows)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Neto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Ingresos ({formatPrice(totalSales)}) - Egresos ({formatPrice(totalOutflows)})
            </span>
            <span className={netTotal >= 0 ? "text-2xl font-bold text-green-700" : "text-2xl font-bold text-red-700"}>
              {formatPrice(netTotal)}
            </span>
          </div>
          {isLoading && (
            <p className="text-sm text-muted-foreground mt-3">Cargando datos del informe...</p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
