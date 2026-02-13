"use client"

import type { Product } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Image from "next/image"
import { formatPrice } from "@/lib/format-price"
import { useDashboardUi } from "@/components/dashboard/dashboard-ui-context"

export function PosProductPicker({ products, onAdd }: { products: Product[]; onAdd: (product: Product) => void }) {
  const { t } = useDashboardUi()

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Productos</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => onAdd(product)}
            className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3 text-left transition hover:border-primary/40 hover:shadow-sm"
          >
            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground truncate">{product.category === "cookies" ? t.products.cookie : t.products.brownie}</p>
              <p className="text-sm font-semibold text-primary">{formatPrice(product.price)}</p>
            </div>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
        {products.length === 0 && <p className="text-sm text-muted-foreground">No hay productos disponibles.</p>}
      </CardContent>
    </Card>
  )
}
