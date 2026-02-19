"use client"

import { useCallback, useEffect, useState } from "react"
import type { Order } from "@/lib/types"
import { fetchOrdersPage } from "@/lib/dashboard/services/orders"
import { useToast } from "@/hooks/use-toast"

export function useOrdersPaginated(input: { origin: "web" | "pos" | "manual"; page: number; pageSize: number; enabled?: boolean }) {
  const { origin, page, pageSize, enabled = true } = input
  const { toast } = useToast()

  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const reloadOrders = useCallback(async () => {
    if (!enabled) return
    setIsLoadingOrders(true)
    try {
      const data = await fetchOrdersPage({ origin, page, pageSize })
      setOrders(data.orders)
      setTotalCount(data.pagination.total)
      setTotalPages(data.pagination.totalPages)
    } catch {
      toast({ title: "Error", description: "No se pudieron cargar las órdenes.", variant: "destructive" })
    } finally {
      setIsLoadingOrders(false)
    }
  }, [enabled, origin, page, pageSize, toast])

  useEffect(() => {
    void reloadOrders()
  }, [reloadOrders])

  return {
    orders,
    isLoadingOrders,
    totalCount,
    totalPages,
    reloadOrders,
  }
}
