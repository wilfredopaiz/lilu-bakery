export type ProductCategory = "cookies" | "brownies"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  image: string
  featured?: boolean
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
  status: "pending" | "paid"
  items: OrderItem[]
  total: number
  createdAt: string
}
