"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Política de Privacidad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              En Lilu&apos;s Bakery tratamos tus datos personales con responsabilidad. Usamos tu información
              únicamente para procesar pedidos, coordinar entregas y brindar soporte al cliente.
            </p>
            <p>
              Los datos que podemos solicitar incluyen nombre, teléfono, dirección de entrega y detalles del
              pedido. No vendemos ni compartimos tus datos con terceros para fines comerciales.
            </p>
            <p>
              Conservamos la información necesaria para fines operativos, administrativos y cumplimiento legal.
              Puedes solicitar actualización o eliminación de tus datos contactándonos por nuestros canales
              oficiales.
            </p>
            <p>
              También puedes consultar nuestra{" "}
              <Link href="/politica-cookies" className="text-primary underline underline-offset-2">
                Política de Cookies
              </Link>{" "}
              y los{" "}
              <Link href="/terminos" className="text-primary underline underline-offset-2">
                Términos y Condiciones
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
