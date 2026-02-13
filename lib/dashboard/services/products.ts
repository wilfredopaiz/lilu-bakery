import { normalizeProduct } from "@/lib/dashboard/mappers"

export async function fetchProducts() {
  const response = await fetch("/api/admin/products")
  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }
  const payload = await response.json()
  return (payload.products || []).map(normalizeProduct)
}

export async function createProduct(input: any) {
  const response = await fetch("/api/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error("Failed to create product")
  }
  const payload = await response.json()
  return normalizeProduct(payload.product)
}

export async function updateProduct(input: any) {
  const response = await fetch("/api/admin/products", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error("Failed to update product")
  }
  const payload = await response.json()
  return normalizeProduct(payload.product)
}

export async function hideProduct(id: string) {
  await updateProduct({ id, channels: [] })
}

export async function reactivateProduct(id: string) {
  await updateProduct({ id, channels: ["ecommerce", "pos"] })
}
