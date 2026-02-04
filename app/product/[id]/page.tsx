"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { getProductById, products } from "@/lib/products"
import { notFound, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { formatPrice } from "@/lib/format-price"
import { useEffect } from "react"

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const { t } = useLanguage()
  
  const product = getProductById(id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!product) {
    notFound()
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <Button asChild variant="ghost" className="mb-8">
          <Link href={`/category/${product.category}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.product.backToProducts}
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <Badge className="w-fit mb-4" variant="secondary">
              {product.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-6">{formatPrice(product.price)}</p>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{product.description}</p>

            <AddToCartButton product={product} className="max-w-md" />

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
