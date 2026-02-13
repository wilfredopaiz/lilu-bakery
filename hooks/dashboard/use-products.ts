"use client"

import { useCallback, useEffect, useState } from "react"
import type { Product } from "@/lib/types"
import { createProduct, fetchProducts, hideProduct, reactivateProduct, updateProduct } from "@/lib/dashboard/services/products"
import { uploadImage } from "@/lib/dashboard/services/uploads"
import { useToast } from "@/hooks/use-toast"

export function useProducts() {
  const { toast } = useToast()
  const [productList, setProductList] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [isSavingProduct, setIsSavingProduct] = useState(false)

  const reloadProducts = useCallback(async () => {
    setIsLoadingProducts(true)
    try {
      const next = await fetchProducts()
      setProductList(next)
    } catch {
      toast({
        title: "Error al cargar",
        description: "No se pudieron cargar los productos.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingProducts(false)
    }
  }, [toast])

  useEffect(() => {
    reloadProducts()
  }, [reloadProducts])

  const addProduct = async (input: {
    name: string
    description: string
    price: string
    category: "cookies" | "brownies"
    channels: Array<"ecommerce" | "pos">
    isSeasonal: boolean
    seasonKey: string | null
    imageFile: File | null
  }) => {
    if (!input.name || !input.description || !input.price || !input.imageFile) {
      toast({
        title: "Faltan datos",
        description: "Nombre, descripción, precio e imagen son obligatorios.",
        variant: "destructive",
      })
      return false
    }

    setIsSavingProduct(true)
    try {
      const imageUrl = await uploadImage(input.imageFile)
      const created = await createProduct({
        name: input.name,
        description: input.description,
        price: parseFloat(input.price),
        category: input.category,
        channels: input.channels,
        isSeasonal: input.isSeasonal,
        seasonKey: input.seasonKey,
        image: imageUrl,
      })
      setProductList((prev) => [...prev, created])
      toast({ title: "Producto creado", description: "El producto se guardó correctamente." })
      return true
    } catch {
      toast({
        title: "Error al crear",
        description: "No se pudo guardar el producto.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsSavingProduct(false)
    }
  }

  const editProduct = async (input: Product, imageFile: File | null) => {
    if (!input.name || !input.description || !input.price) {
      toast({
        title: "Faltan datos",
        description: "Nombre, descripción y precio son obligatorios.",
        variant: "destructive",
      })
      return false
    }

    setIsSavingProduct(true)
    try {
      let image = input.image
      if (imageFile) {
        image = await uploadImage(imageFile)
      }

      const updated = await updateProduct({
        id: input.id,
        name: input.name,
        description: input.description,
        price: input.price,
        category: input.category,
        image,
        featured: Boolean(input.featured),
        channels: input.channels ?? ["ecommerce", "pos"],
        isSeasonal: Boolean(input.isSeasonal),
        seasonKey: input.seasonKey ?? "valentin",
      })
      setProductList((prev) => prev.map((p) => (p.id === input.id ? updated : p)))
      toast({ title: "Producto actualizado", description: "El producto se guardó correctamente." })
      return true
    } catch {
      toast({ title: "Error", description: "No se pudo actualizar el producto.", variant: "destructive" })
      return false
    } finally {
      setIsSavingProduct(false)
    }
  }

  const softHideProduct = async (product: Product) => {
    try {
      await hideProduct(product.id)
      setProductList((prev) => prev.map((item) => (item.id === product.id ? { ...item, channels: [] } : item)))
    } catch {
      toast({ title: "Error", description: "No se pudo ocultar el producto.", variant: "destructive" })
    }
  }

  const restoreProduct = async (id: string) => {
    try {
      await reactivateProduct(id)
      setProductList((prev) => prev.map((item) => (item.id === id ? { ...item, channels: ["ecommerce", "pos"] } : item)))
    } catch {
      toast({ title: "Error", description: "No se pudo reactivar el producto.", variant: "destructive" })
    }
  }

  return {
    productList,
    isLoadingProducts,
    isSavingProduct,
    reloadProducts,
    addProduct,
    editProduct,
    softHideProduct,
    restoreProduct,
  }
}

