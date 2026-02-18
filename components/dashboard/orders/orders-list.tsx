"use client"

import { Button } from "@/components/ui/button"
import type { Order } from "@/lib/types"
import { OrderCardCollapsible } from "@/components/dashboard/orders/order-card-collapsible"

export function OrdersList(props: {
  orders: Order[]
  expandedOrders: string[]
  onToggleExpanded: (orderId: string) => void
  onChangeStatus: (orderId: string, status: "paid" | "pending" | "abandoned" | "cancelled" | "completed") => void
  showPosActions?: boolean
  onEditPos?: (order: Order) => void
  onCancelPos?: (order: Order) => void
  onReactivatePos?: (order: Order) => void
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}) {
  const {
    orders,
    expandedOrders,
    onToggleExpanded,
    onChangeStatus,
    showPosActions,
    onEditPos,
    onCancelPos,
    onReactivatePos,
    page,
    totalPages,
    onPrev,
    onNext,
  } = props

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCardCollapsible
            key={order.id}
            order={order}
            expanded={expandedOrders.includes(order.id)}
            onToggle={() => onToggleExpanded(order.id)}
            onChangeStatus={(status) => onChangeStatus(order.id, status)}
            showPosActions={showPosActions}
            onEditPos={() => onEditPos?.(order)}
            onCancelPos={() => onCancelPos?.(order)}
            onReactivatePos={() => onReactivatePos?.(order)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" className="bg-transparent" onClick={onPrev} disabled={page === 1}>Anterior</Button>
          <span className="text-sm text-muted-foreground">Página {page} de {totalPages}</span>
          <Button variant="outline" className="bg-transparent" onClick={onNext} disabled={page === totalPages}>Siguiente</Button>
        </div>
      )}
    </>
  )
}

