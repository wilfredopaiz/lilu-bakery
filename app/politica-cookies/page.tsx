"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Política de Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Usamos cookies y almacenamiento local para recordar preferencias como idioma, consentimientos y
              mejorar la experiencia de navegación.
            </p>
            <p>
              Estas tecnologías no se usan para vender datos personales. Puedes aceptar o rechazar cookies desde
              el banner de consentimiento y gestionar su uso desde la configuración de tu navegador.
            </p>
            <p>
              Si desactivas cookies, algunas funciones pueden no comportarse como esperas.
            </p>
            <p>
              Más información disponible en nuestra{" "}
              <Link href="/privacidad" className="text-primary underline underline-offset-2">
                Política de Privacidad
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
