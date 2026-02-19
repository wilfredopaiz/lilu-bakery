"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Building2, MessageCircle, Copy, Check } from "lucide-react"
import { formatPrice } from "@/lib/format-price"
import Link from "next/link"
import { useState } from "react"

const bankAccounts = [
  {
    bank: "BAC Credomatic",
    accountNumber: "749486971",
    accountHolder: "Carmen Ondina Paiz Paz",
  },
  {
    bank: "Banco del País (Banpaís)",
    accountNumber: "210510058086",
    accountHolder: "Carmen Ondina Paiz Paz",
  },
  {
    bank: "Banco Atlántida",
    accountNumber: "2020065703",
    accountHolder: "Carmen Ondina Paiz Paz",
  },
]

const whatsappNumber = "+504 9842-1924"
const whatsappLink = "https://wa.me/50498421924"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const orderNumber = searchParams.get("order") || "LB-XXXXX"
  const orderTotal = searchParams.get("total") ? parseFloat(searchParams.get("total")!) : 0
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const copyToClipboard = (text: string, accountId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAccount(accountId)
    setTimeout(() => setCopiedAccount(null), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Header */}
          <Card className="text-center">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              
              <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">{t.confirmation.title}</h1>
              
              <div className="bg-muted/50 rounded-lg p-4 mt-4">
                <p className="text-sm text-muted-foreground mb-1">{t.confirmation.orderNumber}</p>
                <p className="text-xl md:text-2xl font-bold font-mono text-primary">{orderNumber}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="pt-6 pb-6 px-4 md:px-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-amber-900">{t.confirmation.pendingPayment}</h2>
                  <p className="text-amber-800 text-sm mt-1">
                    {t.confirmation.instructionsPart1} <span className="font-bold text-amber-900">{formatPrice(orderTotal)}</span> {t.confirmation.instructionsPart2}
                  </p>
                </div>
              </div>

              {/* Bank Accounts */}
              <div className="space-y-3 mt-6">
                {bankAccounts.map((account, index) => (
                  <div 
                    key={index}
                    className="bg-background rounded-lg p-4 border border-amber-200"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">{account.bank}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t.confirmation.accountNumber}: <span className="font-mono font-semibold text-foreground">{account.accountNumber}</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t.confirmation.accountHolder}: <span className="font-semibold text-foreground">{account.accountHolder}</span>
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0 h-9 w-9 p-0"
                        onClick={() => copyToClipboard(account.accountNumber, account.bank)}
                      >
                        {copiedAccount === account.bank ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>

          {/* WhatsApp Instructions */}
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-6 pb-6 px-4 md:px-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="text-green-800 text-sm">{t.confirmation.sendReceipt}</p>
                  <p className="font-semibold text-green-900 mt-1">{whatsappNumber}</p>
                </div>
              </div>

              <Button 
                asChild 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <a 
                  href={`${whatsappLink}?text=${encodeURIComponent(`Hola! Acabo de realizar un pedido. Mi número de orden es: ${orderNumber}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {t.confirmation.sendReceiptButton}
                </a>
              </Button>

              <p className="text-xs text-green-700 text-center mt-3">
                {t.confirmation.includeOrderNumber}
              </p>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
            <Link href="/">{t.confirmation.backToHome}</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
