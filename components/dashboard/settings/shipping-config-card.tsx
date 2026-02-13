"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ShippingConfigCard({ shippingFee, setShippingFee }: { shippingFee: number; setShippingFee: (next: number) => void }) {
  return (
    <Card>
      <CardHeader><CardTitle>Envío</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shipping-fee">Costo de envío (L)</Label>
          <Input id="shipping-fee" type="number" min={0} step="1" value={shippingFee} onChange={(e) => setShippingFee(Number(e.target.value))} />
        </div>
      </CardContent>
    </Card>
  )
}

