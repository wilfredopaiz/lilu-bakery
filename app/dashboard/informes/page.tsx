"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useOrders } from "@/hooks/dashboard/use-orders"
import { useExpenses } from "@/hooks/dashboard/use-expenses"
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS } from "@/lib/dashboard/services/expenses"
import { formatPrice } from "@/lib/format-price"

function toInputDate(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function getCurrentMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return {
    start: toInputDate(start),
    end: toInputDate(end),
  }
}

function formatReportDate(date: string) {
  const value = new Date(`${date}T00:00:00`).toLocaleDateString("es-HN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  return value.replace(/ de (\d{4})$/, " del $1")
}

export default function DashboardInformesPage() {
  const { start, end } = getCurrentMonthRange()
  const [startDate, setStartDate] = useState(start)
  const [endDate, setEndDate] = useState(end)
  const [appliedStartDate, setAppliedStartDate] = useState(start)
  const [appliedEndDate, setAppliedEndDate] = useState(end)
  const [hasGeneratedReport, setHasGeneratedReport] = useState(false)

  const { orders, isLoadingOrders, reloadOrders } = useOrders(false)
  const { expenses, isLoadingExpenses, reloadExpenses } = useExpenses(false)

  const startAt = useMemo(() => new Date(`${appliedStartDate}T00:00:00`), [appliedStartDate])
  const endAt = useMemo(() => new Date(`${appliedEndDate}T23:59:59.999`), [appliedEndDate])

  const paidOrdersInRange = useMemo(
    () =>
      orders.filter((order) => {
        if (order.status !== "paid") return false
        const created = new Date(order.createdAt)
        return created >= startAt && created <= endAt
      }),
    [orders, startAt, endAt]
  )

  const expensesInRange = useMemo(
    () =>
      expenses.filter((expense) => {
        const expenseDate = new Date(`${expense.expenseDate}T00:00:00`)
        return expenseDate >= startAt && expenseDate <= endAt
      }),
    [expenses, startAt, endAt]
  )

  const ecommerceSales = paidOrdersInRange
    .filter((order) => order.origin === "ecommerce" || !order.origin)
    .reduce((sum, order) => sum + order.total, 0)

  const posSales = paidOrdersInRange
    .filter((order) => order.origin === "pos")
    .reduce((sum, order) => sum + order.total, 0)

  const manualSales = paidOrdersInRange
    .filter((order) => order.origin === "manual")
    .reduce((sum, order) => sum + order.total, 0)

  const totalSales = ecommerceSales + posSales + manualSales

  const expenseByCategory = EXPENSE_CATEGORIES.map((category) => {
    const total = expensesInRange
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
    return { category, total }
  })

  const expensesTotal = expenseByCategory.reduce((sum, item) => sum + item.total, 0)
  const shippingCosts = paidOrdersInRange.reduce((sum, order) => sum + Number(order.shippingFee ?? 0), 0)
  const totalOutflows = expensesTotal + shippingCosts
  const netTotal = totalSales - totalOutflows

  const handleGenerateReport = async () => {
    setAppliedStartDate(startDate)
    setAppliedEndDate(endDate)
    setHasGeneratedReport(true)
    await Promise.all([reloadOrders(), reloadExpenses()])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Informes</h1>
        <p className="text-sm text-muted-foreground">
          Balance contable por rango de fechas (ventas pagadas, gastos y costos de envio).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rango de fechas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="report-start-date">Inicio</Label>
            <Input
              id="report-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-end-date">Final</Label>
            <Input
              id="report-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="button" onClick={handleGenerateReport} disabled={isLoadingOrders || isLoadingExpenses}>
              {isLoadingOrders || isLoadingExpenses ? "Generando..." : "Generar Informe"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!hasGeneratedReport && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Selecciona el rango de fechas y presiona <strong>Generar Informe</strong> para cargar los datos.
            </p>
          </CardContent>
        </Card>
      )}

      {hasGeneratedReport && (
        <>
          <p className="text-sm font-medium text-muted-foreground">
            Informe generado desde <strong>{formatReportDate(appliedStartDate)}</strong> a{" "}
            <strong>{formatReportDate(appliedEndDate)}</strong>
          </p>

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
              {(isLoadingOrders || isLoadingExpenses) && (
                <p className="text-sm text-muted-foreground mt-3">Cargando datos del informe...</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
