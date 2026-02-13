import type { Product, Order } from "@/lib/types"

export interface PosItem {
  product: Product
  quantity: number
}

export interface OrdersPaginationState {
  pageSize: number
  webPage: number
  posPage: number
}

export interface ProductsFilterState {
  pageSize: number
  hideHidden: boolean
  cookiePage: number
  browniePage: number
}

export interface PosEditState {
  order: Order | null
  items: PosItem[]
  customerName: string
  phoneNumber: string
}
