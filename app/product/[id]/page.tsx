"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { notFound, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { formatPrice } from "@/lib/format-price"
import { useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase/client"
import type { Product } from "@/lib/types"

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const { t } = useLanguage()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      setIsLoading(true)

      const { data, error } = await supabaseBrowser
        .from("products")
        .select("*")
        .eq("id", id)
        .contains("channels", ["ecommerce"])
        .single()

      if (!error && data && isMounted) {
        setProduct(data as Product)

        const { data: relatedData } = await supabaseBrowser
          .from("products")
          .select("*")
          .eq("category", data.category)
          .eq("is_seasonal", data.is_seasonal ?? false)
          .contains("channels", ["ecommerce"])
          .neq("id", data.id)
          .limit(4)

        if (relatedData && isMounted) {
          setRelatedProducts(relatedData as Product[])
        }
      } else if (isMounted) {
        setProduct(null)
      }

      if (isMounted) {
        setIsLoading(false)
      }
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [id])

  if (!isLoading && !product) {
    notFound()
  }

  const resolvedProduct = product

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        {resolvedProduct && (
          <Button asChild variant="ghost" className="mb-8">
            <Link href={`/category/${resolvedProduct.category}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.product.backToProducts}
            </Link>
          </Button>
        )}

        {resolvedProduct && (
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="aspect-square relative rounded-2xl overflow-hidden bg-muted">
              <Image
                src={resolvedProduct.image || "/placeholder.svg"}
                alt={resolvedProduct.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col justify-center">
              <Badge className="w-fit mb-4" variant="secondary">
                {resolvedProduct.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{resolvedProduct.name}</h1>
              <p className="text-3xl font-bold text-primary mb-6">{formatPrice(resolvedProduct.price)}</p>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{resolvedProduct.description}</p>

              <AddToCartButton product={resolvedProduct} className="max-w-md" />

              <div className="mt-12 pt-12 border-t border-border">
                <h3 className="font-semibold mb-4">{t.product.productDetails}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ {t.product.madeFreshDaily}</li>
                  <li>✓ {t.product.premiumIngredients}</li>
                  <li>✓ {t.product.handcraftedWithLove}</li>
                  <li>✓ {t.product.perfectForGifting}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-3xl font-serif font-bold mb-8">{t.product.youMayAlsoLike}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}


