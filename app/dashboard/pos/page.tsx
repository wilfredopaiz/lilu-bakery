"use client"

import { useMemo } from "react"
import { useOrders } from "@/hooks/dashboard/use-orders"
import { useProducts } from "@/hooks/dashboard/use-products"
import { usePos } from "@/hooks/dashboard/use-pos"
import { PosProductPicker } from "@/components/dashboard/pos/pos-product-picker"
import { PosCart } from "@/components/dashboard/pos/pos-cart"

export default function DashboardPosPage() {
  const { productList } = useProducts()
  const { reloadOrders } = useOrders(true)
  const posProducts = useMemo(
    () => productList.filter((p) => (p.channels ?? ["ecommerce", "pos"]).includes("pos")),
    [productList]
  )

  const {
    customerName,
    setCustomerName,
    phoneNumber,
    setPhoneNumber,
    items,
    subtotal,
    isSavingPosOrder,
    addPosItem,
    updateQuantity,
    createOrder,
  } = usePos({ productList, reloadOrders })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">POS</h1>
        <p className="text-sm text-muted-foreground">Registra ventas físicas con los productos existentes.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <PosProductPicker products={posProducts} onAdd={addPosItem} />
        <PosCart
          customerName={customerName}
          setCustomerName={setCustomerName}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
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

