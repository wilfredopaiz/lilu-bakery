"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/format-price"

export function OrdersStatusCards(props: {
  paidWeb: number
  pendingWeb: number
  abandonedWeb: number
  cancelledWeb: number
  monthPendingCount: number
  monthPendingTotal: number
  monthCancelledCount: number
  monthCancelledTotal: number
}) {
  const {
    paidWeb,
    pendingWeb,
    abandonedWeb,
    cancelledWeb,
    monthPendingCount,
    monthPendingTotal,
    monthCancelledCount,
    monthCancelledTotal,
  } = props

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ventas pendientes (mes)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Cantidad</span><span className="text-sm font-semibold">{monthPendingCount} ventas</span></div>
            <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Total</span><span className="text-sm font-semibold">{formatPrice(monthPendingTotal)}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ventas canceladas/abandonadas (mes)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Cantidad</span><span className="text-sm font-semibold">{monthCancelledCount} ventas</span></div>
            <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Total</span><span className="text-sm font-semibold">{formatPrice(monthCancelledTotal)}</span></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Órdenes por estado (solo Ecommerce)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3"><span className="text-sm text-muted-foreground">Pagado</span><span className="text-sm font-semibold">{paidWeb}</span></div>
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3"><span className="text-sm text-muted-foreground">Pendiente</span><span className="text-sm font-semibold">{pendingWeb}</span></div>
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3"><span className="text-sm text-muted-foreground">Abandonado</span><span className="text-sm font-semibold">{abandonedWeb}</span></div>
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3"><span className="text-sm text-muted-foreground">Cancelado</span><span className="text-sm font-semibold">{cancelledWeb}</span></div>
        </CardContent>
      </Card>
    </>
  )
}

