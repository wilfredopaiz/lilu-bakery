import { mapOrder } from "@/lib/dashboard/mappers"

export async function fetchOrders() {
  const response = await fetch("/api/admin/orders")
  if (!response.ok) {
    throw new Error("Failed to fetch orders")
  }
  const payload = await response.json()
  return (payload.orders || []).map(mapOrder)
}

export async function fetchOrdersPage(input: { origin: "web" | "pos" | "manual"; page: number; pageSize: number }) {
  const params = new URLSearchParams({
    origin: input.origin,
    page: String(input.page),
    pageSize: String(input.pageSize),
  })
  const response = await fetch(`/api/admin/orders?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch paginated orders")
  }
  const payload = await response.json()
  return {
    orders: (payload.orders || []).map(mapOrder),
    pagination: {
      page: Number(payload?.pagination?.page ?? input.page),
      pageSize: Number(payload?.pagination?.pageSize ?? input.pageSize),
      total: Number(payload?.pagination?.total ?? 0),
      totalPages: Number(payload?.pagination?.totalPages ?? 1),
    },
  }
}

export async function updateOrder(input: any) {
  const response = await fetch("/api/admin/orders", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error("Failed to update order")
  }
}

export async function createPosOrder(input: any) {
  const response = await fetch("/api/admin/pos-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error("Failed to create POS order")
  }
  return response.json()
}
