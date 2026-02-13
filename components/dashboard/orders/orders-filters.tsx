"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function OrdersFilters(props: {
  pageSize: number
  setPageSize: (next: number) => void
  resetPages: () => void
}) {
  const { pageSize, setPageSize, resetPages } = props

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2">
      <Label htmlFor="orders-page-size" className="text-xs text-muted-foreground">Pedidos por página</Label>
      <Select
        value={String(pageSize)}
        onValueChange={(value) => {
          setPageSize(Number(value))
          resetPages()
        }}
      >
        <SelectTrigger id="orders-page-size" className="h-8 w-24"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="4">4</SelectItem>
          <SelectItem value="8">8</SelectItem>
          <SelectItem value="12">12</SelectItem>
          <SelectItem value="16">16</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

