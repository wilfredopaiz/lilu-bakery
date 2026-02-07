"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { useLanguage } from "@/components/language-provider"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase/client"
import type { Product } from "@/lib/types"

export default function HomePage() {
  const { t } = useLanguage()
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadFeatured = async () => {
      const { data, error } = await supabaseBrowser
        .from("products")
        .select("*")
        .eq("featured", true)
        .eq("is_seasonal", false)
        .contains("channels", ["ecommerce"])
        .order("name", { ascending: true })

      if (!error && data && isMounted) {
        setFeatured(data as Product[])
      }
    }

    loadFeatured()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-balance">
                {t.hero.title1} <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  {t.hero.title2}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
                {t.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/category/cookies">
                    {t.hero.shopNow} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
                  <Link href="/category/brownies">{t.hero.browseCookies}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Seasonal Banner */}
        <section className="container mx-auto px-4 py-12">
          <div className="rounded-3xl border border-rose-200/60 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-rose-600 mb-2">
                {t.seasonal.valentinBadge}
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">
                {t.seasonal.valentinTitle}
              </h2>
              <p className="text-muted-foreground">{t.seasonal.valentinDesc}</p>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link href="/seasonal/valentin">
                {t.seasonal.valentinCta} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">{t.home.bestsellers}</h2>
            <p className="text-muted-foreground text-lg">{t.home.bestsellersDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <Link href="/category/cookies" className="group">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 p-8 hover:shadow-xl transition-all">
                  <div className="relative z-10">
                    <h3 className="text-4xl font-serif font-bold mb-4">{t.home.cookiesTitle}</h3>
                    <p className="text-muted-foreground mb-6 text-lg">{t.home.cookiesDesc}</p>
                    <Button variant="secondary" className="group-hover:translate-x-1 transition-transform">
                      {t.home.exploreCookies} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>

              <Link href="/category/brownies" className="group">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-gradient-to-br from-accent/20 to-secondary/20 p-8 hover:shadow-xl transition-all">
                  <div className="relative z-10">
                    <h3 className="text-4xl font-serif font-bold mb-4">{t.home.browniesTitle}</h3>
                    <p className="text-muted-foreground mb-6 text-lg">{t.home.browniesDesc}</p>
                    <Button variant="secondary" className="group-hover:translate-x-1 transition-transform">
                      {t.home.exploreBrownies} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🍪</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{t.home.freshDaily}</h3>
              <p className="text-muted-foreground text-sm">{t.home.freshDailyDesc}</p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">💝</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{t.home.madeWithLove}</h3>
              <p className="text-muted-foreground text-sm">{t.home.madeWithLoveDesc}</p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-full bg-secondary/10 mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{t.home.premiumQuality}</h3>
              <p className="text-muted-foreground text-sm">{t.home.premiumQualityDesc}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
