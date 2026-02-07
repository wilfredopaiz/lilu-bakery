"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { supabaseBrowser } from "@/lib/supabase/client"
import type { Product } from "@/lib/types"
import { ArrowRight } from "lucide-react"

export default function ValentinPage() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadSeasonal = async () => {
      const { data, error } = await supabaseBrowser
        .from("products")
        .select("*")
        .eq("is_seasonal", true)
        .eq("season_key", "valentin")
        .contains("channels", ["ecommerce"])
        .order("name", { ascending: true })

      if (!error && data && isMounted) {
        setProducts(data as Product[])
      }
    }

    loadSeasonal()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-200/40 via-rose-100/40 to-red-100/50">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.2em] text-rose-600 mb-3">
                {t.seasonal.valentinBadge}
              </p>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-balance">
                {t.seasonal.valentinTitle}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {t.seasonal.valentinDesc}
              </p>
              <Button asChild className="gap-2">
                <Link href="/category/cookies">
                  {t.seasonal.valentinCta} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          {products.length === 0 ? (
            <p className="text-muted-foreground">{t.seasonal.empty}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
