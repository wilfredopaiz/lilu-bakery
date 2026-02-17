"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Términos y Condiciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Al realizar una compra aceptas nuestras condiciones de preparación, entrega y pago.
            </p>
            <p>
              Los pedidos están sujetos a disponibilidad de productos y a confirmación. En caso de cambios o
              imprevistos, te contactaremos para ofrecer alternativas.
            </p>
            <p>
              Los tiempos de entrega son estimados y pueden variar según demanda, clima o logística. Actualmente,
              los envíos se realizan únicamente en San Pedro Sula.
            </p>
            <p>
              Para dudas sobre tratamiento de datos o cookies, revisa la{" "}
              <Link href="/privacidad" className="text-primary underline underline-offset-2">
                Política de Privacidad
              </Link>{" "}
              y la{" "}
              <Link href="/politica-cookies" className="text-primary underline underline-offset-2">
                Política de Cookies
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
