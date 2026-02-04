"use client"

import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/lib/products"
import { useState } from "react"

interface AddToCartButtonProps {
  product: Product
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button onClick={handleAddToCart} className={`w-full ${className}`} disabled={added}>
      <ShoppingBag className="mr-2 h-4 w-4" />
      {added ? "Added!" : "Add to Cart"}
    </Button>
  )
}
