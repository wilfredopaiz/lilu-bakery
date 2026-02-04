"use client"
import { Header } from "@/components/header"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Badge } from "@/components/ui/badge"
import { Star, Sparkles, Award } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"

// Mock data for the cookie of the month
const galletondy = {
  id: "galletondy-1",
  name: "La Galletondy",
  tagline: "La Galleta del Mes",
  description:
    "Una explosión de sabor con chips de chocolate belga, caramelo salado y un toque de vainilla de Madagascar. Horneada a la perfección con mantequilla europea premium.",
  longDescription:
    "Cada mordida de La Galletondy es una experiencia única. Comenzamos con nuestra masa secreta de mantequilla europea, agregamos generosos trozos de chocolate belga de 70% cacao, remolinos de caramelo salado artesanal, y un toque final de vainilla pura de Madagascar. El resultado es una galleta con bordes crujientes y centro suave que te transportará al paraíso.",
  price: 16.99,
  originalPrice: 19.99,
  image: "/galletondy-hero.jpg",
  category: "cookies" as const,
  highlights: [
    "Chocolate Belga 70% Cacao",
    "Caramelo Salado Artesanal",
    "Vainilla de Madagascar",
    "Mantequilla Europea Premium",
  ],
  stats: [
    { label: "Valoración", value: "5.0", icon: Star },
    { label: "Este Mes", value: "Exclusiva", icon: Sparkles },
    { label: "Premio", value: "Mejor del Año", icon: Award },
  ],
}

export default function GalletondyPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Header />
      <div className="min-w-0 overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-accent text-accent-foreground text-sm px-4 py-1">
                Edición Especial - Febrero 2026
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary mb-4">
                {galletondy.name}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">{galletondy.tagline}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
              {/* Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={galletondy.image || "/placeholder.svg"}
                  alt={galletondy.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                  -15%
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Una Experiencia Inolvidable</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{galletondy.description}</p>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-2 gap-3">
                  {galletondy.highlights.map((highlight, index) => (
                    <div key={index} className="bg-background border border-border rounded-lg p-3 text-center">
                      <p className="text-sm font-medium text-foreground">{highlight}</p>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 py-4">
                  {galletondy.stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-accent" />
                        <div>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                          <p className="font-bold text-foreground">{stat.value}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Price and CTA */}
                <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-primary">${galletondy.price}</span>
                    <span className="text-xl text-muted-foreground line-through">${galletondy.originalPrice}</span>
                    <Badge variant="secondary" className="ml-auto">
                      Precio Especial
                    </Badge>
                  </div>
                  <AddToCartButton
                    product={{
                      id: galletondy.id,
                      name: galletondy.name,
                      price: galletondy.price,
                      image: galletondy.image,
                      category: galletondy.category,
                      description: galletondy.description,
                    }}
                    className="w-full h-12 text-lg"
                  />
                  <p className="text-xs text-center text-muted-foreground">
                    Disponible solo durante febrero • Envío gratis en pedidos +$50
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Description */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-serif font-bold text-center mb-8">La Historia Detrás de La Galletondy</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed text-center">{galletondy.longDescription}</p>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-primary/5 rounded-xl">
                <div className="text-4xl mb-2">🍫</div>
                <h3 className="font-bold mb-2">Ingredientes Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Solo usamos los mejores ingredientes importados de todo el mundo
                </p>
              </div>
              <div className="text-center p-6 bg-accent/5 rounded-xl">
                <div className="text-4xl mb-2">👩‍🍳</div>
                <h3 className="font-bold mb-2">Hecho a Mano</h3>
                <p className="text-sm text-muted-foreground">
                  Cada galleta es horneada con amor y cuidado en nuestro taller
                </p>
              </div>
              <div className="text-center p-6 bg-secondary/5 rounded-xl">
                <div className="text-4xl mb-2">⭐</div>
                <h3 className="font-bold mb-2">Edición Limitada</h3>
                <p className="text-sm text-muted-foreground">Disponible solo este mes, no te lo pierdas</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-r from-primary via-accent to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">¿Lista para probar La Galletondy?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Esta experiencia única solo estará disponible durante febrero. ¡Haz tu pedido hoy!
            </p>
            <AddToCartButton
              product={{
                id: galletondy.id,
                name: galletondy.name,
                price: galletondy.price,
                image: galletondy.image,
                category: galletondy.category,
                description: galletondy.description,
              }}
              variant="secondary"
              className="h-12 px-8 text-lg"
            />
          </div>
        </section>
      </div>
    </>
  )
}
