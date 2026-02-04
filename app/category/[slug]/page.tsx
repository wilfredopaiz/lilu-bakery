"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { getProductsByCategory } from "@/lib/products"
import { notFound, useParams } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useEffect } from "react"

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const { t } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (slug !== "cookies" && slug !== "brownies") {
    notFound()
  }

  const categoryProducts = getProductsByCategory(slug)
  const title = slug === "cookies" ? t.home.cookiesTitle : t.home.browniesTitle
  const description = slug === "cookies" ? t.category.cookiesDesc : t.category.browniesDesc

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{title}</h1>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
