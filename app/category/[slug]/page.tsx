"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { notFound, useParams } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase/client"
import type { Product } from "@/lib/types"

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const { t } = useLanguage()
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (slug !== "cookies" && slug !== "brownies") {
    notFound()
  }

  useEffect(() => {
    let isMounted = true

    const loadCategory = async () => {
      const { data, error } = await supabaseBrowser
        .from("products")
        .select("*")
        .eq("category", slug)
        .order("name", { ascending: true })

      if (!error && data && isMounted) {
        setCategoryProducts(data as Product[])
      }
    }

    loadCategory()

    return () => {
      isMounted = false
    }
  }, [slug])

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
