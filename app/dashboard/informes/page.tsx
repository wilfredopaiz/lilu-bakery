"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useOrders } from "@/hooks/dashboard/use-orders"
import { useExpenses } from "@/hooks/dashboard/use-expenses"
import { useProductReport } from "@/hooks/dashboard/use-product-report"
import { EXPENSE_CATEGORIES } from "@/lib/dashboard/services/expenses"
import { ReportTypeSelector, type ReportType } from "@/components/dashboard/reports/report-type-selector"
import { GeneralReport } from "@/components/dashboard/reports/general-report"
import { ProductsReportSummary } from "@/components/dashboard/reports/products-report-summary"
import { ProductsReportTable } from "@/components/dashboard/reports/products-report-table"

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
  const [reportType, setReportType] = useState<ReportType>("general")
  const [appliedReportType, setAppliedReportType] = useState<ReportType>("general")
  const [hasGeneratedReport, setHasGeneratedReport] = useState(false)

  const { orders, isLoadingOrders, reloadOrders } = useOrders(false)
  const { expenses, isLoadingExpenses, reloadExpenses } = useExpenses(false)
  const { rows: productRows, isLoading: isLoadingProductReport, generate } = useProductReport()

  const startAt = useMemo(() => new Date(`${appliedStartDate}T00:00:00`), [appliedStartDate])
  const endAt = useMemo(() => new Date(`${appliedEndDate}T23:59:59.999`), [appliedEndDate])

  const paidOrdersInRange = useMemo(
    () =>
      orders.filter((order) => {
        if (order.status !== "paid" && order.status !== "completed") return false
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
    setAppliedReportType(reportType)
    setHasGeneratedReport(true)

    if (reportType === "general") {
      await Promise.all([reloadOrders(), reloadExpenses()])
      return
    }

    await generate({ startDate, endDate })
  }

  const isGenerating =
    reportType === "general" ? (isLoadingOrders || isLoadingExpenses) : isLoadingProductReport

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Informes</h1>
        <p className="text-sm text-muted-foreground">
          Genera reportes por rango de fechas: general o de productos por canal.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Opciones del informe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>
          <ReportTypeSelector value={reportType} onChange={setReportType} />
          <div>
            <Button type="button" onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? "Generando..." : "Generar Informe"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!hasGeneratedReport && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Selecciona rango y tipo de informe, luego presiona <strong>Generar Informe</strong>.
            </p>
          </CardContent>
        </Card>
      )}

      {hasGeneratedReport && (
        <>
          <p className="text-sm font-medium text-muted-foreground">
            Informe <strong>{appliedReportType === "general" ? "General" : "Productos"}</strong> generado desde{" "}
            <strong>{formatReportDate(appliedStartDate)}</strong> a{" "}
            <strong>{formatReportDate(appliedEndDate)}</strong>
          </p>

          {appliedReportType === "general" ? (
            <GeneralReport
              ecommerceSales={ecommerceSales}
              posSales={posSales}
              manualSales={manualSales}
              totalSales={totalSales}
              expenseByCategory={expenseByCategory}
              shippingCosts={shippingCosts}
              totalOutflows={totalOutflows}
              netTotal={netTotal}
              isLoading={isLoadingOrders || isLoadingExpenses}
            />
          ) : (
            <>
              <ProductsReportSummary rows={productRows} />
              <ProductsReportTable rows={productRows} />
            </>
          )}
        </>
      )}
    </div>
  )
}
