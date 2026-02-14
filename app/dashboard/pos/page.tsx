"use client"

import { useMemo } from "react"
import { useOrders } from "@/hooks/dashboard/use-orders"
import { useProducts } from "@/hooks/dashboard/use-products"
import { usePos } from "@/hooks/dashboard/use-pos"
import { PosProductPicker } from "@/components/dashboard/pos/pos-product-picker"
import { PosCart } from "@/components/dashboard/pos/pos-cart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPosPage() {
  const { productList } = useProducts()
  const { reloadOrders } = useOrders(true)

  const {
    customerName,
    setCustomerName,
    phoneNumber,
    setPhoneNumber,
    notes,
    setNotes,
    saleOrigin,
    setSaleOrigin,
    items,
    subtotal,
    isSavingPosOrder,
    addPosItem,
    updateQuantity,
    createOrder,
  } = usePos({ productList, reloadOrders })
  const posProducts = useMemo(() => {
    if (saleOrigin === "manual-full") {
      return productList.filter((p) => {
        const channels = p.channels ?? ["ecommerce", "pos"]
        return channels.includes("ecommerce") || channels.includes("pos")
      })
    }
    return productList.filter((p) => (p.channels ?? ["ecommerce", "pos"]).includes("pos"))
  }, [productList, saleOrigin])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-serif font-bold">POS</h1>
          <p className="text-sm text-muted-foreground">Registra ventas físicas con los productos existentes.</p>
        </div>
        <div className="w-full sm:w-56">
          <Select value={saleOrigin} onValueChange={(value: "pos" | "manual" | "manual-full") => setSaleOrigin(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pos">POS</SelectItem>
              <SelectItem value="manual">Ingreso Manual</SelectItem>
              <SelectItem value="manual-full">Ingreso Manual (Full)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <PosProductPicker products={posProducts} onAdd={addPosItem} />
        <PosCart
          saleOrigin={saleOrigin}
          customerName={customerName}
          setCustomerName={setCustomerName}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          notes={notes}
          setNotes={setNotes}
          items={items}
          subtotal={subtotal}
          isSaving={isSavingPosOrder}
          onUpdateQuantity={updateQuantity}
          onCreateOrder={createOrder}
        />
      </div>
    </div>
  )
}

