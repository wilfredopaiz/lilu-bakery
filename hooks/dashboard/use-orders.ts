"use client"

import { useCallback, useEffect, useState } from "react"
import type { Order } from "@/lib/types"
import { fetchOrders, updateOrder } from "@/lib/dashboard/services/orders"
import { useToast } from "@/hooks/use-toast"

export function useOrders(enabled = true) {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)

  const reloadOrders = useCallback(async () => {
    setIsLoadingOrders(true)
    try {
      const data = await fetchOrders()
      setOrders(data)
    } catch {
      toast({ title: "Error", description: "No se pudieron cargar las órdenes.", variant: "destructive" })
    } finally {
      setIsLoadingOrders(false)
    }
  }, [enabled, toast])

  useEffect(() => {
    if (enabled) {
      reloadOrders()
    }
  }, [enabled, reloadOrders])

  const changeOrderStatus = async (
    orderId: string,
    status: "paid" | "pending" | "abandoned" | "cancelled" | "completed"
  ) => {
    try {
      await updateOrder({ id: orderId, status })
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))
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

  const updatePosOrder = async (input: {
    id: string
    customerName: string
    phoneNumber: string
    items: Array<{ productId: string; productName: string; quantity: number; price: number }>
  }) => {
    try {
      await updateOrder(input)
      await reloadOrders()
      return true
    } catch {
      toast({ title: "Error", description: "No se pudo actualizar la venta POS.", variant: "destructive" })
      return false
    }
  }

  const updateInternalNotes = async (orderId: string, internalNotes: string) => {
    try {
      await updateOrder({ id: orderId, internalNotes })
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, internalNotes: internalNotes.trim() || null } : order
        )
      )
      toast({ title: "Notas internas actualizadas", description: "Los cambios se guardaron correctamente." })
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

  return {
    orders,
    isLoadingOrders,
    reloadOrders,
    changeOrderStatus,
    updatePosOrder,
    updateInternalNotes,
  }
}

