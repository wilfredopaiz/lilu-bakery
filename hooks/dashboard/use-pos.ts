"use client"

import { useMemo, useState } from "react"
import type { Order, Product } from "@/lib/types"
import type { PosItem } from "@/hooks/dashboard/types"
import { createPosOrder, updateOrder } from "@/lib/dashboard/services/orders"
import { useToast } from "@/hooks/use-toast"

export function usePos(params: { productList: Product[]; reloadOrders: () => Promise<void> }) {
  const { toast } = useToast()
  const { productList, reloadOrders } = params

  const [customerName, setCustomerName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [saleOrigin, setSaleOrigin] = useState<"pos" | "manual" | "manual-full">("pos")
  const [items, setItems] = useState<PosItem[]>([])
  const [isSavingPosOrder, setIsSavingPosOrder] = useState(false)

  const [isEditingPosOrder, setIsEditingPosOrder] = useState(false)
  const [editOrder, setEditOrder] = useState<Order | null>(null)
  const [editItems, setEditItems] = useState<PosItem[]>([])
  const [editCustomerName, setEditCustomerName] = useState("")
  const [editPhoneNumber, setEditPhoneNumber] = useState("")
  const [editShippingFee, setEditShippingFee] = useState(0)

  const [isCancelPosDialogOpen, setIsCancelPosDialogOpen] = useState(false)
  const [cancelPosOrderId, setCancelPosOrderId] = useState<string | null>(null)

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  )

  const editSubtotal = useMemo(
    () => editItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [editItems]
  )

  const addPosItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId))
      return
    }
    setItems((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const createOrder = async () => {
    if (items.length === 0) return false
    setIsSavingPosOrder(true)
    try {
      await createPosOrder({
        customerName,
        phoneNumber,
        notes,
        currency: "HNL",
        origin: saleOrigin === "pos" ? "pos" : "manual",
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
      })
      setCustomerName("")
      setPhoneNumber("")
      setNotes("")
      setItems([])
      await reloadOrders()
      toast({
        title: "Venta registrada",
        description:
          saleOrigin === "pos"
            ? "La venta POS se guardó correctamente."
            : saleOrigin === "manual-full"
              ? "La venta manual full se guardó correctamente."
              : "La venta manual se guardó correctamente.",
        variant: "success",
      })
      return true
    } catch {
      toast({ title: "Error al guardar", description: "No se pudo registrar la venta POS.", variant: "destructive" })
      return false
    } finally {
      setIsSavingPosOrder(false)
    }
  }

  const openEdit = (order: Order) => {
    const parsed = order.items
      .map((item) => {
        const product = productList.find((p) => p.id === item.productId)
        if (product) {
          return { product, quantity: item.quantity }
        }
        return {
          product: {
            id: item.productId,
            name: item.productName,
            description: "Producto sin catálogo",
            price: item.price,
            image: "/placeholder.svg",
            category: "cookies",
          },
          quantity: item.quantity,
        }
      })
      .filter(Boolean) as PosItem[]

    setEditOrder(order)
    setEditItems(parsed)
    setEditCustomerName(order.customerName)
    setEditPhoneNumber(order.phoneNumber)
    setEditShippingFee(Number(order.shippingFee ?? 0))
    setIsEditingPosOrder(true)
  }

  const updateEditQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setEditItems((prev) => prev.filter((item) => item.product.id !== productId))
      return
    }
    setEditItems((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const saveEdit = async () => {
    if (!editOrder) return false
    setIsSavingPosOrder(true)
    try {
      await updateOrder({
        id: editOrder.id,
        customerName: editCustomerName || "Cliente POS",
        phoneNumber: editPhoneNumber || "0",
        shippingFee: Number(editShippingFee) || 0,
        items: editItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
      })
      setIsEditingPosOrder(false)
      setEditOrder(null)
      setEditItems([])
      await reloadOrders()
      toast({ title: "Venta actualizada", description: "Los cambios se guardaron correctamente.", variant: "success" })
      return true
    } catch {
      toast({ title: "Error", description: "No se pudo actualizar la venta POS.", variant: "destructive" })
      return false
    } finally {
      setIsSavingPosOrder(false)
    }
  }

  const cancelPosOrder = async (orderId: string) => {
    try {
      await updateOrder({ id: orderId, status: "cancelled" })
      await reloadOrders()
      toast({ title: "Venta cancelada", description: "La venta se marcó como cancelada." })
      return true
    } catch {
      toast({ title: "Error", description: "No se pudo cancelar la venta.", variant: "destructive" })
      return false
    }
  }

  const reactivatePosOrder = async (orderId: string) => {
    try {
      await updateOrder({ id: orderId, status: "paid" })
      await reloadOrders()
      toast({ title: "Venta reactivada", description: "La venta volvió a estado pagado.", variant: "success" })
      return true
    } catch {
      toast({ title: "Error", description: "No se pudo reactivar la venta.", variant: "destructive" })
      return false
    }
  }

  return {
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
    isEditingPosOrder,
    setIsEditingPosOrder,
    editOrder,
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
  }
}

