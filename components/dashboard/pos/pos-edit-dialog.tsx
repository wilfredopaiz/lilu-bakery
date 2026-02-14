"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/format-price"
import type { PosItem } from "@/hooks/dashboard/types"

export function PosEditDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerName: string
  setCustomerName: (value: string) => void
  phoneNumber: string
  setPhoneNumber: (value: string) => void
  shippingFee: number
  setShippingFee: (value: number) => void
  items: PosItem[]
  subtotal: number
  isSaving: boolean
  onUpdateQuantity: (productId: string, quantity: number) => void
  onSave: () => void
}) {
  const {
    open,
    onOpenChange,
    customerName,
    setCustomerName,
    phoneNumber,
    setPhoneNumber,
    shippingFee,
    setShippingFee,
    items,
    subtotal,
    isSaving,
    onUpdateQuantity,
    onSave,
  } = props

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar venta POS</DialogTitle>
          <DialogDescription>Actualiza los datos y productos vendidos.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label htmlFor="pos-edit-name">Cliente</Label><Input id="pos-edit-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="pos-edit-phone">Teléfono</Label><Input id="pos-edit-phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></div>
          <div className="space-y-2">
            <Label htmlFor="pos-edit-shipping-fee">Envío (L)</Label>
            <Input
              id="pos-edit-shipping-fee"
              type="number"
              min={0}
              step="1"
              value={shippingFee}
              onChange={(e) => setShippingFee(Number(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Productos</p>
            {items.length === 0 && <p className="text-sm text-muted-foreground">Agrega productos para esta venta.</p>}
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

          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-sm font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Envío</span>
              <span className="text-sm font-semibold">{formatPrice(shippingFee)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-sm font-semibold">{formatPrice(subtotal + shippingFee)}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="bg-transparent" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSave} disabled={isSaving}>{isSaving ? "Guardando..." : "Guardar cambios"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

