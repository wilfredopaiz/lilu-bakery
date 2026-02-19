export type ProductCategory = "cookies" | "brownies"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  image: string
  featured?: boolean
  channels?: Array<"ecommerce" | "pos">
  isSeasonal?: boolean
  seasonKey?: string | null
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  lineTotal?: number
}

export interface Order {
  id: string
  orderNumber?: string
  customerName: string
  phoneNumber: string
  status: "pending" | "paid" | "abandoned" | "cancelled" | "completed"
  origin?: "ecommerce" | "pos" | "manual"
  items: OrderItem[]
  total: number
  createdAt: string
  shippingDate?: string | null
  shippingFee?: number
  notes?: string | null
  internalNotes?: string | null
}
