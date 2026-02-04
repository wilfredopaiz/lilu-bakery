"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Building2, CreditCard, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/format-price"
import { supabaseBrowser } from "@/lib/supabase/client"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { t } = useLanguage()
  const router = useRouter()
  const shippingFee = 120
  const totalWithShipping = total + shippingFee
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) return
    if (items.length === 0) return

    setIsSubmitting(true)
    setErrorMessage("")

    const { data } = await supabaseBrowser.auth.getSession()
    const accessToken = data.session?.access_token

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        customerName: name,
        phoneNumber: phone,
        paymentMethod,
        currency: "HNL",
        shippingFee,
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    })

    if (!response.ok) {
      setErrorMessage("Unable to place order. Please try again.")
      setIsSubmitting(false)
      return
    }

    const payload = await response.json()
    const orderTotal = Number(payload.total)
    const orderNumber = payload.orderNumber as string

    clearCart()
    router.push(`/checkout/confirmation?order=${orderNumber}&total=${orderTotal.toFixed(2)}`)
    setIsSubmitting(false)
  }

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
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6 md:mb-8">{t.checkout.title}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.checkout.contactInfo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.checkout.name}</Label>
                    <Input
                      id="name"
                      placeholder={t.checkout.namePlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t.checkout.phone}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t.checkout.phonePlaceholder}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.checkout.paymentMethod}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      {/* Bank Transfer */}
                      <label
                        htmlFor="bank-transfer"
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          paymentMethod === "bank-transfer"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-6 w-6 text-secondary-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{t.checkout.bankTransfer}</p>
                          <p className="text-sm text-muted-foreground">{t.checkout.bankTransferDesc}</p>
                        </div>
                      </label>

                      {/* Credit Card - Disabled */}
                      <div
                        className="flex items-center gap-4 p-4 rounded-lg border-2 border-border bg-muted/50 opacity-60 cursor-not-allowed"
                      >
                        <RadioGroupItem value="credit-card" id="credit-card" disabled />
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <CreditCard className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-muted-foreground">{t.checkout.creditCard}</p>
                            <Badge variant="secondary" className="text-xs">{t.checkout.comingSoon}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{t.checkout.creditCardDesc}</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="lg:sticky lg:top-24">
                <CardHeader>
                  <CardTitle>{t.checkout.orderSummary}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                          <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                          <p className="text-sm font-semibold text-primary">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t.cart.subtotal}</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t.cart.shipping}</span>
                      <span className="text-secondary-foreground">{formatPrice(shippingFee)}</span>
                    </div>
                    <div className="border-t border-border pt-4 flex justify-between text-lg font-bold">
                      <span>{t.checkout.total}</span>
                      <span className="text-primary">{formatPrice(totalWithShipping)}</span>
                    </div>
                  </div>

                  {errorMessage && (
                    <p className="text-sm text-destructive">{errorMessage}</p>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={!name || !phone || isSubmitting}
                  >
                    {isSubmitting ? t.checkout.processing : t.checkout.placeOrder}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}


