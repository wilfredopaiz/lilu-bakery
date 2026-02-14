"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/format-price"

export function SalesSummaryCards(props: {
  dayEcommerceTotal: number
  dayPosTotal: number
  dayManualTotal: number
  dayTotal: number
  dayEcommerceCount: number
  dayPosCount: number
  dayManualCount: number
  weekEcommerceTotal: number
  weekPosTotal: number
  weekManualTotal: number
  weekTotal: number
  weekEcommerceCount: number
  weekPosCount: number
  weekManualCount: number
  monthEcommerceTotal: number
  monthPosTotal: number
  monthManualTotal: number
  monthTotal: number
  monthEcommerceCount: number
  monthPosCount: number
  monthManualCount: number
}) {
  const {
    dayEcommerceTotal,
    dayPosTotal,
    dayManualTotal,
    dayTotal,
    dayEcommerceCount,
    dayPosCount,
    dayManualCount,
    weekEcommerceTotal,
    weekPosTotal,
    weekManualTotal,
    weekTotal,
    weekEcommerceCount,
    weekPosCount,
    weekManualCount,
    monthEcommerceTotal,
    monthPosTotal,
    monthManualTotal,
    monthTotal,
    monthEcommerceCount,
    monthPosCount,
    monthManualCount,
  } = props

  const cards = [
    {
      title: "Ventas del día",
      ecommerce: dayEcommerceTotal,
      pos: dayPosTotal,
      manual: dayManualTotal,
      total: dayTotal,
      ecommerceCount: dayEcommerceCount,
      posCount: dayPosCount,
      manualCount: dayManualCount,
    },
    {
      title: "Ventas de la semana",
      ecommerce: weekEcommerceTotal,
      pos: weekPosTotal,
      manual: weekManualTotal,
      total: weekTotal,
      ecommerceCount: weekEcommerceCount,
      posCount: weekPosCount,
      manualCount: weekManualCount,
    },
    {
      title: "Ventas del mes",
      ecommerce: monthEcommerceTotal,
      pos: monthPosTotal,
      manual: monthManualTotal,
      total: monthTotal,
      ecommerceCount: monthEcommerceCount,
      posCount: monthPosCount,
      manualCount: monthManualCount,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-5 space-y-2">
            <p className="text-sm font-semibold">{card.title}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Ecommerce</span>
              <span className="text-sm font-semibold">{formatPrice(card.ecommerce)} ({card.ecommerceCount} ventas)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">POS</span>
              <span className="text-sm font-semibold">{formatPrice(card.pos)} ({card.posCount} ventas)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Ventas Manuales</span>
              <span className="text-sm font-semibold">{formatPrice(card.manual)} ({card.manualCount} ventas)</span>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 pt-2">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-sm font-semibold">{formatPrice(card.total)} ({card.ecommerceCount + card.posCount + card.manualCount} ventas)</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

