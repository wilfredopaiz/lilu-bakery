"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { useOrders } from "@/hooks/dashboard/use-orders"
import { useProducts } from "@/hooks/dashboard/use-products"
import { SalesSummaryCards } from "@/components/dashboard/analytics/sales-summary-cards"
import { SalesCharts } from "@/components/dashboard/analytics/sales-charts"
import { OrdersStatusCards } from "@/components/dashboard/analytics/orders-status-cards"
import type { Order } from "@/lib/types"

const LEGACY_TAB_REDIRECTS: Record<string, string> = {
  products: "/dashboard/productos",
  pos: "/dashboard/pos",
  orders: "/dashboard/pedidos",
  reports: "/dashboard/informes",
  expenses: "/dashboard/gastos",
  settings: "/dashboard/configuracion",
}

export default function DashboardOverviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { orders } = useOrders(true)
  const { productList } = useProducts()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (!tab) return
    const next = LEGACY_TAB_REDIRECTS[tab]
    if (next) {
      router.replace(next)
    }
  }, [searchParams, router])

  const now = new Date()
  const paidOrders = orders.filter((order) => order.status === "paid" || order.status === "completed")
  const paidEcommerceOrders = paidOrders.filter((order) => order.origin !== "pos" && order.origin !== "manual")
  const paidPosOrders = paidOrders.filter((order) => order.origin === "pos")
  const paidManualOrders = paidOrders.filter((order) => order.origin === "manual")

  const sameDay = (order: Order) => {
    const created = new Date(order.createdAt)
    return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth() && created.getDate() === now.getDate()
  }

  const sameMonth = (order: Order) => {
    const created = new Date(order.createdAt)
    return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth()
  }

  const weekStart = new Date(now)
  const dayOfWeek = weekStart.getDay()
  const diffToMonday = (dayOfWeek + 6) % 7
  weekStart.setDate(weekStart.getDate() - diffToMonday)
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  const inWeek = (order: Order) => {
    const created = new Date(order.createdAt)
    return created >= weekStart && created <= weekEnd
  }

  const dayEcommerceOrders = paidEcommerceOrders.filter(sameDay)
  const dayPosOrders = paidPosOrders.filter(sameDay)
  const dayManualOrders = paidManualOrders.filter(sameDay)
  const weekEcommerceOrders = paidEcommerceOrders.filter(inWeek)
  const weekPosOrders = paidPosOrders.filter(inWeek)
  const weekManualOrders = paidManualOrders.filter(inWeek)
  const monthEcommerceOrders = paidEcommerceOrders.filter(sameMonth)
  const monthPosOrders = paidPosOrders.filter(sameMonth)
  const monthManualOrders = paidManualOrders.filter(sameMonth)

  const dayEcommerceTotal = dayEcommerceOrders.reduce((sum, order) => sum + order.total, 0)
  const dayPosTotal = dayPosOrders.reduce((sum, order) => sum + order.total, 0)
  const dayManualTotal = dayManualOrders.reduce((sum, order) => sum + order.total, 0)
  const weekEcommerceTotal = weekEcommerceOrders.reduce((sum, order) => sum + order.total, 0)
  const weekPosTotal = weekPosOrders.reduce((sum, order) => sum + order.total, 0)
  const weekManualTotal = weekManualOrders.reduce((sum, order) => sum + order.total, 0)
  const monthEcommerceTotal = monthEcommerceOrders.reduce((sum, order) => sum + order.total, 0)
  const monthPosTotal = monthPosOrders.reduce((sum, order) => sum + order.total, 0)
  const monthManualTotal = monthManualOrders.reduce((sum, order) => sum + order.total, 0)

  const monthLabels = Array.from({ length: 2 }, (_v, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (1 - index), 1)
    return { label: date.toLocaleString("es", { month: "short" }), year: date.getFullYear(), month: date.getMonth() }
  })

  const salesByMonth = monthLabels.map((monthInfo) => {
    const inMonth = (order: Order) => {
      const created = new Date(order.createdAt)
      return created.getFullYear() === monthInfo.year && created.getMonth() === monthInfo.month
    }
    const ecommerce = paidEcommerceOrders.filter(inMonth).reduce((sum, order) => sum + order.total, 0)
    const pos = paidPosOrders.filter(inMonth).reduce((sum, order) => sum + order.total, 0)
    const manual = paidManualOrders.filter(inMonth).reduce((sum, order) => sum + order.total, 0)
    return { label: monthInfo.label, ecommerce, pos, manual, total: ecommerce + pos + manual }
  })

  const categoryByProduct = new Map(productList.map((product) => [product.id, product.category]))
  const categoryByMonth = monthLabels.map((monthInfo) => {
    const inMonth = (order: Order) => {
      const created = new Date(order.createdAt)
      return created.getFullYear() === monthInfo.year && created.getMonth() === monthInfo.month
    }
    const totals = paidOrders
      .filter(inMonth)
      .reduce(
        (acc, order) => {
          order.items.forEach((item) => {
            const category = categoryByProduct.get(item.productId)
            const lineTotal = item.price * item.quantity
            if (category === "cookies") acc.cookies += lineTotal
            if (category === "brownies") acc.brownies += lineTotal
          })
          return acc
        },
        { cookies: 0, brownies: 0 }
      )
    return { label: monthInfo.label, cookies: totals.cookies, brownies: totals.brownies }
  })

  const chartData = salesByMonth.map((entry, index) => ({
    month: entry.label,
    ecommerce: entry.ecommerce,
    pos: entry.pos,
    manual: entry.manual,
    total: entry.total,
    cookies: categoryByMonth[index]?.cookies ?? 0,
    brownies: categoryByMonth[index]?.brownies ?? 0,
  }))

  const monthPendingOrders = orders.filter((order) => order.status === "pending" && sameMonth(order))
  const monthCancelledOrders = orders.filter((order) => (order.status === "cancelled" || order.status === "abandoned") && sameMonth(order))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumen de ventas por canal</p>
      </div>

      <SalesSummaryCards
        dayEcommerceTotal={dayEcommerceTotal}
        dayPosTotal={dayPosTotal}
        dayManualTotal={dayManualTotal}
        dayTotal={dayEcommerceTotal + dayPosTotal + dayManualTotal}
        dayEcommerceCount={dayEcommerceOrders.length}
        dayPosCount={dayPosOrders.length}
        dayManualCount={dayManualOrders.length}
        weekEcommerceTotal={weekEcommerceTotal}
        weekPosTotal={weekPosTotal}
        weekManualTotal={weekManualTotal}
        weekTotal={weekEcommerceTotal + weekPosTotal + weekManualTotal}
        weekEcommerceCount={weekEcommerceOrders.length}
        weekPosCount={weekPosOrders.length}
        weekManualCount={weekManualOrders.length}
        monthEcommerceTotal={monthEcommerceTotal}
        monthPosTotal={monthPosTotal}
        monthManualTotal={monthManualTotal}
        monthTotal={monthEcommerceTotal + monthPosTotal + monthManualTotal}
        monthEcommerceCount={monthEcommerceOrders.length}
        monthPosCount={monthPosOrders.length}
        monthManualCount={monthManualOrders.length}
      />

      <SalesCharts chartData={chartData} />

      <OrdersStatusCards
        paidWeb={orders.filter((order) => order.origin !== "pos" && order.origin !== "manual" && order.status === "paid").length}
        pendingWeb={orders.filter((order) => order.origin !== "pos" && order.origin !== "manual" && order.status === "pending").length}
        abandonedWeb={orders.filter((order) => order.origin !== "pos" && order.origin !== "manual" && order.status === "abandoned").length}
        cancelledWeb={orders.filter((order) => order.origin !== "pos" && order.origin !== "manual" && order.status === "cancelled").length}
        monthPendingCount={monthPendingOrders.length}
        monthPendingTotal={monthPendingOrders.reduce((sum, order) => sum + order.total, 0)}
        monthCancelledCount={monthCancelledOrders.length}
        monthCancelledTotal={monthCancelledOrders.reduce((sum, order) => sum + order.total, 0)}
      />

      {orders.length === 0 && (
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">Sin órdenes aún.</CardContent>
        </Card>
      )}
    </div>
  )
}

