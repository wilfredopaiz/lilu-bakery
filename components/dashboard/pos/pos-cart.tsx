"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/format-price"
import type { PosItem } from "@/hooks/dashboard/types"
import { useDashboardUi } from "@/components/dashboard/dashboard-ui-context"

export function PosCart(props: {
  customerName: string
  setCustomerName: (value: string) => void
  phoneNumber: string
  setPhoneNumber: (value: string) => void
  items: PosItem[]
  subtotal: number
  isSaving: boolean
  onUpdateQuantity: (productId: string, quantity: number) => void
  onCreateOrder: () => void
}) {
  const { t } = useDashboardUi()
  const { customerName, setCustomerName, phoneNumber, setPhoneNumber, items, subtotal, isSaving, onUpdateQuantity, onCreateOrder } = props

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Nueva venta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2"><Label htmlFor="pos-customer">Cliente</Label><Input id="pos-customer" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Nombre del cliente" /></div>
        <div className="space-y-2"><Label htmlFor="pos-phone">Teléfono</Label><Input id="pos-phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Número de teléfono" /></div>
        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2"><span className="text-sm text-muted-foreground">Estado</span><span className="text-sm font-semibold">{t.orders.paid}</span></div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Items</p>
          {items.length === 0 && <p className="text-sm text-muted-foreground">Agrega productos a la venta.</p>}
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">{formatPrice(item.product.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} value={item.quantity} onChange={(e) => onUpdateQuantity(item.product.id, Number(e.target.value))} className="h-8 w-16" />
                <span className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onUpdateQuantity(item.product.id, 0)} aria-label="Remove item"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-3 flex items-center justify-between"><span className="text-sm text-muted-foreground">Total</span><span className="text-sm font-semibold">{formatPrice(subtotal)}</span></div>

        <Button className="w-full" onClick={onCreateOrder} disabled={isSaving || items.length === 0}>{isSaving ? "Guardando..." : "Registrar venta"}</Button>
      </CardContent>
    </Card>
  )
}

