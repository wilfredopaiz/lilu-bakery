"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const COOKIE_CONSENT_KEY = "lilu-cookie-consent"
const SHIPPING_NOTICE_KEY = "lilu-shipping-notice-seen"

export function GlobalNotices() {
  const [cookieConsent, setCookieConsent] = useState<"accepted" | "rejected" | null>(null)
  const [showShippingNotice, setShowShippingNotice] = useState(false)

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (storedConsent === "accepted" || storedConsent === "rejected") {
      setCookieConsent(storedConsent)
    }

    const shippingSeen = localStorage.getItem(SHIPPING_NOTICE_KEY)
    if (!shippingSeen) {
      setShowShippingNotice(true)
    }
  }, [])

  const handleCookieConsent = (value: "accepted" | "rejected") => {
    localStorage.setItem(COOKIE_CONSENT_KEY, value)
    setCookieConsent(value)
  }

  const closeShippingNotice = () => {
    localStorage.setItem(SHIPPING_NOTICE_KEY, "true")
    setShowShippingNotice(false)
  }

  return (
    <>
      {cookieConsent === null && (
        <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <p className="text-sm text-muted-foreground">
              Usamos cookies para mejorar tu experiencia. Al continuar, aceptas nuestra{" "}
              <Link href="/politica-cookies" className="text-primary underline underline-offset-2">
                Política de Cookies
              </Link>
              .
            </p>
            <div className="flex items-center gap-2 sm:ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={() => handleCookieConsent("rejected")}
              >
                Rechazar
              </Button>
              <Button size="sm" onClick={() => handleCookieConsent("accepted")}>
                Aceptar
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showShippingNotice} onOpenChange={(open) => !open && closeShippingNotice()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Información de envíos</DialogTitle>
            <DialogDescription>
              Por ahora, realizamos envíos únicamente a San Pedro Sula.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={closeShippingNotice}>Entendido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
