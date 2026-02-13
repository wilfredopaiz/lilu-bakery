"use client"

import { useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOrders } from "@/hooks/dashboard/use-orders"
import { useProducts } from "@/hooks/dashboard/use-products"
import { usePos } from "@/hooks/dashboard/use-pos"
import { OrdersFilters } from "@/components/dashboard/orders/orders-filters"
import { OrdersList } from "@/components/dashboard/orders/orders-list"
import { PosEditDialog } from "@/components/dashboard/pos/pos-edit-dialog"
import { PosCancelDialog } from "@/components/dashboard/pos/pos-cancel-dialog"

export default function DashboardPedidosPage() {
  const { orders, changeOrderStatus, reloadOrders } = useOrders(true)
  const { productList } = useProducts()
  const {
    isSavingPosOrder,
    isEditingPosOrder,
    setIsEditingPosOrder,
    editItems,
    editCustomerName,
    setEditCustomerName,
    editPhoneNumber,
    setEditPhoneNumber,
    editSubtotal,
    openEdit,
    updateEditQuantity,
    saveEdit,
    isCancelPosDialogOpen,
    setIsCancelPosDialogOpen,
    cancelPosOrderId,
    setCancelPosOrderId,
    cancelPosOrder,
    reactivatePosOrder,
  } = usePos({ productList, reloadOrders })

  const [expandedOrders, setExpandedOrders] = useState<string[]>([])
  const [ordersPageSize, setOrdersPageSize] = useState(8)
  const [webOrdersPage, setWebOrdersPage] = useState(1)
  const [posOrdersPage, setPosOrdersPage] = useState(1)

  const webOrders = useMemo(() => orders.filter((order) => order.origin !== "pos"), [orders])
  const posOrders = useMemo(() => orders.filter((order) => order.origin === "pos"), [orders])

  const webOrdersTotalPages = Math.max(1, Math.ceil(webOrders.length / ordersPageSize))
  const posOrdersTotalPages = Math.max(1, Math.ceil(posOrders.length / ordersPageSize))

  const pagedWebOrders = webOrders.slice((webOrdersPage - 1) * ordersPageSize, webOrdersPage * ordersPageSize)
  const pagedPosOrders = posOrders.slice((posOrdersPage - 1) * ordersPageSize, posOrdersPage * ordersPageSize)

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Ventas</h1>
          <p className="text-muted-foreground text-sm">{orders.length} pedidos en total</p>
        </div>
        <OrdersFilters
          pageSize={ordersPageSize}
          setPageSize={setOrdersPageSize}
          resetPages={() => {
            setWebOrdersPage(1)
            setPosOrdersPage(1)
          }}
        />
      </div>

      <Tabs defaultValue="web" className="space-y-4">
        <TabsList className="flex w-fit">
          <TabsTrigger value="web">Pedidos Web</TabsTrigger>
          <TabsTrigger value="pos">Ventas POS</TabsTrigger>
        </TabsList>

        <TabsContent value="web" className="space-y-4">
          <OrdersList
            orders={pagedWebOrders
              .slice()
              .sort((a, b) => {
                if (!a.shippingDate && !b.shippingDate) return 0
                if (!a.shippingDate) return 1
                if (!b.shippingDate) return -1
                return a.shippingDate.localeCompare(b.shippingDate)
              })}
            expandedOrders={expandedOrders}
            onToggleExpanded={toggleOrderExpanded}
            onChangeStatus={(orderId, status) => {
              void changeOrderStatus(orderId, status)
            }}
            originLabel="Ecommerce"
            page={webOrdersPage}
            totalPages={webOrdersTotalPages}
            onPrev={() => setWebOrdersPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setWebOrdersPage((prev) => Math.min(webOrdersTotalPages, prev + 1))}
          />
        </TabsContent>

        <TabsContent value="pos" className="space-y-4">
          <OrdersList
            orders={pagedPosOrders}
            expandedOrders={expandedOrders}
            onToggleExpanded={toggleOrderExpanded}
            onChangeStatus={(orderId, status) => {
              void changeOrderStatus(orderId, status)
            }}
            originLabel="POS"
            showPosActions
            onEditPos={(order) => openEdit(order)}
            onCancelPos={(order) => {
              setCancelPosOrderId(order.id)
              setIsCancelPosDialogOpen(true)
            }}
            onReactivatePos={(order) => {
              void reactivatePosOrder(order.id)
            }}
            page={posOrdersPage}
            totalPages={posOrdersTotalPages}
            onPrev={() => setPosOrdersPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setPosOrdersPage((prev) => Math.min(posOrdersTotalPages, prev + 1))}
          />
        </TabsContent>
      </Tabs>

      <PosEditDialog
        open={isEditingPosOrder}
        onOpenChange={setIsEditingPosOrder}
        customerName={editCustomerName}
        setCustomerName={setEditCustomerName}
        phoneNumber={editPhoneNumber}
        setPhoneNumber={setEditPhoneNumber}
        items={editItems}
        subtotal={editSubtotal}
        isSaving={isSavingPosOrder}
        onUpdateQuantity={updateEditQuantity}
        onSave={() => {
          void saveEdit()
        }}
      />

      <PosCancelDialog
        open={isCancelPosDialogOpen}
        onOpenChange={setIsCancelPosDialogOpen}
        onCancel={() => setCancelPosOrderId(null)}
        onConfirm={async () => {
          if (!cancelPosOrderId) return
          await cancelPosOrder(cancelPosOrderId)
          setCancelPosOrderId(null)
        }}
      />
    </div>
  )
}
