"use client"

import { useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOrdersPaginated } from "@/hooks/dashboard/use-orders-paginated"
import { useProducts } from "@/hooks/dashboard/use-products"
import { usePos } from "@/hooks/dashboard/use-pos"
import { OrdersFilters } from "@/components/dashboard/orders/orders-filters"
import { OrdersList } from "@/components/dashboard/orders/orders-list"
import { PosEditDialog } from "@/components/dashboard/pos/pos-edit-dialog"
import { PosCancelDialog } from "@/components/dashboard/pos/pos-cancel-dialog"
import type { Order } from "@/lib/types"
import { updateOrder } from "@/lib/dashboard/services/orders"
import { useToast } from "@/hooks/use-toast"

function getTodayStart() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

function sortOrdersForDashboard(orders: Order[]) {
  const todayStart = getTodayStart()

  return orders.slice().sort((a, b) => {
    const aHasShipping = Boolean(a.shippingDate)
    const bHasShipping = Boolean(b.shippingDate)
    const aShippingTime = aHasShipping ? new Date(`${a.shippingDate}T00:00:00`).getTime() : Number.POSITIVE_INFINITY
    const bShippingTime = bHasShipping ? new Date(`${b.shippingDate}T00:00:00`).getTime() : Number.POSITIVE_INFINITY
    const aUpcomingPaid = a.status === "paid" && aHasShipping && aShippingTime >= todayStart.getTime()
    const bUpcomingPaid = b.status === "paid" && bHasShipping && bShippingTime >= todayStart.getTime()
    const aCompleted = a.status === "completed"
    const bCompleted = b.status === "completed"

    if (aUpcomingPaid && bUpcomingPaid) {
      if (aShippingTime !== bShippingTime) return aShippingTime - bShippingTime
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }

    if (aUpcomingPaid !== bUpcomingPaid) return aUpcomingPaid ? -1 : 1
    if (aCompleted !== bCompleted) return aCompleted ? 1 : -1

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export default function DashboardPedidosPage() {
  const { toast } = useToast()
  const { productList } = useProducts()

  const [activeTab, setActiveTab] = useState<"web" | "pos" | "manual">("web")
  const [ordersPageSize, setOrdersPageSize] = useState(8)
  const [webOrdersPage, setWebOrdersPage] = useState(1)
  const [posOrdersPage, setPosOrdersPage] = useState(1)
  const [manualOrdersPage, setManualOrdersPage] = useState(1)

  const webOrdersState = useOrdersPaginated({ origin: "web", page: webOrdersPage, pageSize: ordersPageSize })
  const posOrdersState = useOrdersPaginated({ origin: "pos", page: posOrdersPage, pageSize: ordersPageSize })
  const manualOrdersState = useOrdersPaginated({ origin: "manual", page: manualOrdersPage, pageSize: ordersPageSize })

  const reloadActiveTab = async () => {
    if (activeTab === "web") return webOrdersState.reloadOrders()
    if (activeTab === "pos") return posOrdersState.reloadOrders()
    return manualOrdersState.reloadOrders()
  }

  const changeOrderStatus = async (
    orderId: string,
    status: "paid" | "pending" | "abandoned" | "cancelled" | "completed"
  ) => {
    try {
      await updateOrder({ id: orderId, status })
      await reloadActiveTab()
      return true
    } catch {
      toast({
        title: "Error al actualizar",
        description: "No se pudo cambiar el estado de la venta.",
        variant: "destructive",
      })
      return false
    }
  }

  const updateInternalNotes = async (orderId: string, internalNotes: string) => {
    try {
      await updateOrder({ id: orderId, internalNotes })
      await reloadActiveTab()
      return true
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron actualizar las notas internas.",
        variant: "destructive",
      })
      return false
    }
  }

  const {
    isSavingPosOrder,
    isEditingPosOrder,
    setIsEditingPosOrder,
    editItems,
    editCustomerName,
    setEditCustomerName,
    editPhoneNumber,
    setEditPhoneNumber,
    editShippingFee,
    setEditShippingFee,
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
  } = usePos({ productList, reloadOrders: reloadActiveTab })

  const [expandedOrders, setExpandedOrders] = useState<string[]>([])

  const webOrders = useMemo(
    () => sortOrdersForDashboard(webOrdersState.orders),
    [webOrdersState.orders]
  )
  const posOrders = useMemo(
    () => sortOrdersForDashboard(posOrdersState.orders),
    [posOrdersState.orders]
  )
  const manualOrders = useMemo(
    () => sortOrdersForDashboard(manualOrdersState.orders),
    [manualOrdersState.orders]
  )

  const totalOrders = webOrdersState.totalCount + posOrdersState.totalCount + manualOrdersState.totalCount

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Ventas</h1>
          <p className="text-muted-foreground text-sm">{totalOrders} pedidos en total</p>
        </div>
        <OrdersFilters
          pageSize={ordersPageSize}
          setPageSize={setOrdersPageSize}
          resetPages={() => {
            setWebOrdersPage(1)
            setPosOrdersPage(1)
            setManualOrdersPage(1)
          }}
        />
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "web" | "pos" | "manual")} className="space-y-4">
        <TabsList className="flex w-fit">
          <TabsTrigger value="web">Pedidos Web</TabsTrigger>
          <TabsTrigger value="pos">Ventas POS</TabsTrigger>
          <TabsTrigger value="manual">Pedidos Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="web" className="space-y-4">
          <OrdersList
            orders={webOrders}
            expandedOrders={expandedOrders}
            onToggleExpanded={toggleOrderExpanded}
            onChangeStatus={(orderId, status) => {
              void changeOrderStatus(orderId, status)
            }}
            onSaveInternalNotes={(orderId, internalNotes) => updateInternalNotes(orderId, internalNotes)}
            onEditPos={(order) => openEdit(order)}
            page={webOrdersPage}
            totalPages={webOrdersState.totalPages}
            onPrev={() => setWebOrdersPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setWebOrdersPage((prev) => Math.min(webOrdersState.totalPages, prev + 1))}
          />
        </TabsContent>

        <TabsContent value="pos" className="space-y-4">
          <OrdersList
            orders={posOrders}
            expandedOrders={expandedOrders}
            onToggleExpanded={toggleOrderExpanded}
            onChangeStatus={(orderId, status) => {
              void changeOrderStatus(orderId, status)
            }}
            onSaveInternalNotes={(orderId, internalNotes) => updateInternalNotes(orderId, internalNotes)}
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
            totalPages={posOrdersState.totalPages}
            onPrev={() => setPosOrdersPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setPosOrdersPage((prev) => Math.min(posOrdersState.totalPages, prev + 1))}
          />
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <OrdersList
            orders={manualOrders}
            expandedOrders={expandedOrders}
            onToggleExpanded={toggleOrderExpanded}
            onChangeStatus={(orderId, status) => {
              void changeOrderStatus(orderId, status)
            }}
            onSaveInternalNotes={(orderId, internalNotes) => updateInternalNotes(orderId, internalNotes)}
            showPosActions
            onEditPos={(order) => openEdit(order)}
            onCancelPos={(order) => {
              setCancelPosOrderId(order.id)
              setIsCancelPosDialogOpen(true)
            }}
            onReactivatePos={(order) => {
              void reactivatePosOrder(order.id)
            }}
            page={manualOrdersPage}
            totalPages={manualOrdersState.totalPages}
            onPrev={() => setManualOrdersPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setManualOrdersPage((prev) => Math.min(manualOrdersState.totalPages, prev + 1))}
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
        shippingFee={editShippingFee}
        setShippingFee={setEditShippingFee}
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
