"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/lib/types"
import { useEffect, useRef, useState } from "react"
import { toast } from "@/hooks/use-toast"

interface QuantitySelectorProps {
  product: Product
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost"
}

export function QuantitySelector({ product, className, variant = "default" }: QuantitySelectorProps) {
  const { addItem, removeItem, getItemQuantity } = useCart()
  const [localQuantity, setLocalQuantity] = useState(0)
  const debounceTimer = useRef<NodeJS.Timeout>()
  const isInitialMount = useRef(true)
  const cartQuantityWhenDebounceStarted = useRef(0)

  useEffect(() => {
    const currentQuantity = getItemQuantity(product.id)
    setLocalQuantity(currentQuantity)
  }, [product.id, getItemQuantity])

  const updateCart = (newQuantity: number, cartQuantityAtStart: number) => {
    const diff = newQuantity - cartQuantityAtStart

    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        })
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        removeItem(product.id)
      }
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 0) return

    if (!debounceTimer.current) {
      cartQuantityWhenDebounceStarted.current = getItemQuantity(product.id)
    }

    const oldQuantity = localQuantity
    setLocalQuantity(newQuantity)

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      updateCart(newQuantity, cartQuantityWhenDebounceStarted.current)

      if (!isInitialMount.current) {
        if (newQuantity > oldQuantity) {
          toast({
            title: "Agregado al carrito",
            description: `${product.name} se agregó al carrito.`,
            duration: 2000,
            className: "border-amber-200 bg-amber-50 text-amber-900",
          })
        } else if (newQuantity < oldQuantity && newQuantity === 0) {
          toast({
            title: "Removido del carrito",
            description: `${product.name} se eliminó del carrito.`,
            duration: 2000,
            className: "border-amber-200 bg-amber-50 text-amber-900",
          })
        } else if (newQuantity < oldQuantity) {
          toast({
            title: "Carrito actualizado",
            description: `Cantidad de ${product.name} actualizada.`,
            duration: 2000,
            className: "border-amber-200 bg-amber-50 text-amber-900",
          })
        }
      }

      debounceTimer.current = undefined
    }, 500)
  }

  useEffect(() => {
    isInitialMount.current = false
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        variant={variant}
        size="icon"
        onClick={() => handleQuantityChange(localQuantity - 1)}
        disabled={localQuantity === 0}
        className="h-10 w-10"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="w-12 text-center">
        <span className="text-lg font-semibold">{localQuantity}</span>
      </div>

      <Button
        variant={variant}
        size="icon"
        onClick={() => handleQuantityChange(localQuantity + 1)}
        className="h-10 w-10"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
