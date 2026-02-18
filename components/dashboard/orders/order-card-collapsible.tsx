"use client"

import type { Order } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/format-price"
import { useDashboardUi } from "@/components/dashboard/dashboard-ui-context"

function getTotalProducts(order: Order) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

function getShippingPill(order: Order): { text: string; tone: "info" | "danger" } | null {
  if (!order.shippingDate) return null
  if (order.status === "completed" || order.status === "cancelled" || order.status === "abandoned") return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const shipping = new Date(`${order.shippingDate}T00:00:00`)
  if (Number.isNaN(shipping.getTime())) return null
  if (shipping < today) {
    if (order.status === "paid") {
      return { text: "Fecha de envío vencida: marcar como completado", tone: "danger" }
    }
    return null
  }

  const dayMs = 24 * 60 * 60 * 1000
  const diffDays = Math.round((shipping.getTime() - today.getTime()) / dayMs)

  if (diffDays === 0) return { text: "Se debe enviar hoy", tone: "info" }
  if (diffDays === 1) return { text: "Envío en 1 día", tone: "info" }
  return { text: `Envío en ${diffDays} días`, tone: "info" }
}

export function OrderCardCollapsible(props: {
  order: Order
  expanded: boolean
  onToggle: () => void
  onChangeStatus: (status: "paid" | "pending" | "abandoned" | "cancelled" | "completed") => void
  showPosActions?: boolean
  onEditPos?: () => void
  onCancelPos?: () => void
  onReactivatePos?: () => void
}) {
  const { t } = useDashboardUi()
  const { order, expanded, onToggle, onChangeStatus, showPosActions, onEditPos, onCancelPos, onReactivatePos } = props
  const originLabel =
    order.origin === "manual" ? "Manual" : order.origin === "pos" ? "POS" : "Ecommerce"
  const shippingPill = getShippingPill(order)
  const statusLabel =
    order.status === "paid"
      ? t.orders.paid
      : order.status === "pending"
        ? t.orders.pending
        : order.status === "abandoned"
          ? t.orders.abandoned
          : order.status === "cancelled"
            ? t.orders.cancelled
            : t.orders.completed
  const statusClassName =
    order.status === "paid"
      ? "bg-green-500 hover:bg-green-600 text-white"
      : order.status === "pending"
        ? "bg-amber-500 hover:bg-amber-600 text-white"
        : order.status === "abandoned"
          ? "bg-slate-400 hover:bg-slate-500 text-white"
          : order.status === "cancelled"
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"

  return (
    <Collapsible open={expanded} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div>
                  <CardTitle className="text-base">{order.customerName}</CardTitle>
                  <CardDescription>{order.phoneNumber}{order.orderNumber ? ` · ${order.orderNumber}` : ` · ${order.id}`}</CardDescription>
                </div>
                {order.shippingDate && (
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">
                      Envío: {new Date(`${order.shippingDate}T00:00:00`).toLocaleDateString("es-HN")}
                    </div>
                    {shippingPill && (
                      <Badge
                        variant="secondary"
                        className={
                          shippingPill.tone === "danger"
                            ? "text-xs bg-red-100 text-red-800 hover:bg-red-100"
                            : "text-xs bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {shippingPill.text}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge
                  variant="secondary"
                  className={statusClassName}
                >
                  {statusLabel}
                </Badge>
                <Badge variant="outline">{originLabel}</Badge>
                <span className="text-sm text-muted-foreground">{getTotalProducts(order)} {t.orders.products}</span>
                <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                {expanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="border-t pt-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h4 className="font-medium">{t.orders.orderDetail}</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {order.phoneNumber !== "0" && (
                    <Button variant="outline" size="sm" className="bg-transparent" asChild>
                      <Link
                        href={`https://wa.me/${order.phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${order.customerName}, seguimos tu pedido. Orden: ${order.orderNumber ?? order.id}`)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Link>
                    </Button>
                  )}
                  <span className="text-sm text-muted-foreground">{t.orders.changeStatus}:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        {statusLabel}
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onChangeStatus("paid") }}>{t.orders.markAsPaid}</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onChangeStatus("completed") }}>{t.orders.markAsCompleted}</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onChangeStatus("cancelled") }}>{t.orders.cancelled}</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onChangeStatus("abandoned") }}>{t.orders.abandoned}</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onChangeStatus("pending") }}>{t.orders.markAsPending}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {onEditPos && (
                    <Button variant="outline" size="sm" className="bg-transparent" onClick={(e) => { e.stopPropagation(); onEditPos() }}>
                      Editar
                    </Button>
                  )}
                  {showPosActions && (
                    <>
                      {order.status === "cancelled" ? (
                        <Button variant="outline" size="sm" className="bg-transparent" onClick={(e) => { e.stopPropagation(); onReactivatePos?.() }}>Reactivar</Button>
                      ) : (
                        <Button variant="outline" size="sm" className="bg-transparent text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); onCancelPos?.() }}>Cancelar</Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.orders.product}</TableHead>
                      <TableHead className="text-center">{t.orders.quantity}</TableHead>
                      <TableHead className="text-right">{t.orders.unitPrice}</TableHead>
                      <TableHead className="text-right">{t.orders.subtotal}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, idx) => (
                      <TableRow key={`${order.id}-${idx}`}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium text-muted-foreground">Subtotal</TableCell>
                      <TableCell className="text-right font-medium text-muted-foreground">{formatPrice(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium text-muted-foreground">Envío</TableCell>
                      <TableCell className="text-right font-medium text-muted-foreground">{formatPrice(Number(order.shippingFee ?? 0))}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">{t.orders.total}</TableCell>
                      <TableCell className="text-right font-bold text-primary">{formatPrice(order.total)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {order.notes && (
                <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                  <p className="text-xs font-medium text-muted-foreground">Notas</p>
                  <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

