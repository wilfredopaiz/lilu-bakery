"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/format-price"

export function SalesSummaryCards(props: {
  dayEcommerceTotal: number
  dayPosTotal: number
  dayTotal: number
  dayEcommerceCount: number
  dayPosCount: number
  weekEcommerceTotal: number
  weekPosTotal: number
  weekTotal: number
  weekEcommerceCount: number
  weekPosCount: number
  monthEcommerceTotal: number
  monthPosTotal: number
  monthTotal: number
  monthEcommerceCount: number
  monthPosCount: number
}) {
  const {
    dayEcommerceTotal,
    dayPosTotal,
    dayTotal,
    dayEcommerceCount,
    dayPosCount,
    weekEcommerceTotal,
    weekPosTotal,
    weekTotal,
    weekEcommerceCount,
    weekPosCount,
    monthEcommerceTotal,
    monthPosTotal,
    monthTotal,
    monthEcommerceCount,
    monthPosCount,
  } = props

  const cards = [
    {
      title: "Ventas del día",
      ecommerce: dayEcommerceTotal,
      pos: dayPosTotal,
      total: dayTotal,
      ecommerceCount: dayEcommerceCount,
      posCount: dayPosCount,
    },
    {
      title: "Ventas de la semana",
      ecommerce: weekEcommerceTotal,
      pos: weekPosTotal,
      total: weekTotal,
      ecommerceCount: weekEcommerceCount,
      posCount: weekPosCount,
    },
    {
      title: "Ventas del mes",
      ecommerce: monthEcommerceTotal,
      pos: monthPosTotal,
      total: monthTotal,
      ecommerceCount: monthEcommerceCount,
      posCount: monthPosCount,
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
            <div className="flex items-center justify-between border-t border-border/60 pt-2">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-sm font-semibold">{formatPrice(card.total)} ({card.ecommerceCount + card.posCount} ventas)</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

