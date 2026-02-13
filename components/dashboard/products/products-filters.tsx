"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProductsFilters(props: {
  pageSize: number
  setPageSize: (next: number) => void
  hideHidden: boolean
  setHideHidden: (next: boolean) => void
  resetPages: () => void
}) {
  const { pageSize, setPageSize, hideHidden, setHideHidden, resetPages } = props

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-3 py-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="products-page-size" className="text-xs text-muted-foreground">Por página</Label>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            setPageSize(Number(value))
            resetPages()
          }}
        >
          <SelectTrigger id="products-page-size" className="h-8 w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="8">8</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="16">16</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="hide-hidden-products" checked={hideHidden} onCheckedChange={(checked) => setHideHidden(Boolean(checked))} />
        <Label htmlFor="hide-hidden-products" className="text-xs text-muted-foreground">Quitar ocultos</Label>
      </div>
    </div>
  )
}

