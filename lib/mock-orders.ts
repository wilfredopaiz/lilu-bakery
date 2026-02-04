import type { Order } from "@/lib/types"
import { products } from "./products"

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "María García",
    phoneNumber: "+52 55 1234 5678",
    status: "paid",
    items: [
      { productId: "1", productName: "Classic Chocolate Chip", quantity: 2, price: 12.99 },
      { productId: "4", productName: "Salted Caramel Brownie", quantity: 1, price: 15.99 },
    ],
    total: 41.97,
    createdAt: "2026-01-28T10:30:00",
  },
  {
    id: "ORD-002",
    customerName: "Ana López",
    phoneNumber: "+52 55 9876 5432",
    status: "pending",
    items: [
      { productId: "3", productName: "Pink Sugar Cookies", quantity: 3, price: 11.99 },
      { productId: "2", productName: "Double Fudge Brownie", quantity: 2, price: 14.99 },
      { productId: "8", productName: "Lemon Lavender Cookie", quantity: 1, price: 12.99 },
    ],
    total: 78.94,
    createdAt: "2026-01-28T09:15:00",
  },
  {
    id: "ORD-003",
    customerName: "Carmen Rodríguez",
    phoneNumber: "+52 55 5555 1234",
    status: "paid",
    items: [
      { productId: "9", productName: "Triple Chocolate Brownie", quantity: 4, price: 16.99 },
    ],
    total: 67.96,
    createdAt: "2026-01-27T16:45:00",
  },
  {
    id: "ORD-004",
    customerName: "Sofía Martínez",
    phoneNumber: "+52 55 4321 8765",
    status: "pending",
    items: [
      { productId: "6", productName: "White Chocolate Macadamia", quantity: 2, price: 13.99 },
      { productId: "7", productName: "Peanut Butter Cup Brownie", quantity: 2, price: 15.99 },
      { productId: "10", productName: "Snickerdoodle", quantity: 3, price: 11.99 },
    ],
    total: 95.93,
    createdAt: "2026-01-27T14:20:00",
  },
  {
    id: "ORD-005",
    customerName: "Isabella Fernández",
    phoneNumber: "+52 55 7777 8888",
    status: "paid",
    items: [
      { productId: "12", productName: "Matcha White Chocolate", quantity: 6, price: 13.99 },
    ],
    total: 83.94,
    createdAt: "2026-01-26T11:00:00",
  },
]
