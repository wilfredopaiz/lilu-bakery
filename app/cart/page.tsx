"use client"

import { Header } from "@/components/header"
import { formatPrice } from "@/lib/format-price"
import { Footer } from "@/components/footer"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect } from "react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { t } = useLanguage()
  const shippingFee = 120
  const totalWithShipping = total + shippingFee

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-4">{t.cart.empty}</h1>
            <p className="text-muted-foreground mb-8">{t.cart.emptyDesc}</p>
            <Button asChild size="lg">
              <Link href="/category/cookies">{t.cart.startShopping}</Link>
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6 md:mb-8">{t.cart.title}</h1>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-4 overflow-hidden">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base md:text-lg mb-1 line-clamp-2">{item.name}</h3>
                        <p className="text-primary font-bold mb-3">{formatPrice(item.price)}</p>

                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between">
                        <p className="font-bold text-lg order-1 sm:order-2">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive order-2 sm:order-1"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-24">
              <CardContent className="p-4 md:p-6 space-y-4">
                <h2 className="text-xl md:text-2xl font-serif font-bold">{t.cart.orderSummary}</h2>

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-sm md:text-base text-muted-foreground">
                    <span>{t.cart.subtotal}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-muted-foreground">
                    <span>{t.cart.shipping}</span>
                    <span className="text-secondary-foreground">{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between text-lg md:text-xl font-bold">
                    <span>{t.cart.total}</span>
                    <span className="text-primary">{formatPrice(totalWithShipping)}</span>
                  </div>
                </div>

                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">{t.cart.proceedToCheckout}</Link>
                </Button>

                <Button variant="ghost" className="w-full" onClick={clearCart}>
                  {t.cart.clearCart}
                </Button>

                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/category/cookies">{t.cart.continueShopping}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
