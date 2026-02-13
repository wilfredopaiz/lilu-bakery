import { mapOrder } from "@/lib/dashboard/mappers"

export async function fetchOrders() {
  const response = await fetch("/api/admin/orders")
  if (!response.ok) {
    throw new Error("Failed to fetch orders")
  }
  const payload = await response.json()
  return (payload.orders || []).map(mapOrder)
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
