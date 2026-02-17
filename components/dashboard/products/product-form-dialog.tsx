"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useDashboardUi } from "@/components/dashboard/dashboard-ui-context"

interface NewProductState {
  name: string
  description: string
  price: string
  category: "cookies" | "brownies"
  channels: Array<"ecommerce" | "pos">
  isSeasonal: boolean
  seasonKey: string | null
}

export function ProductFormDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  newProduct: NewProductState
  setNewProduct: (value: NewProductState) => void
  setImageFile: (file: File | null) => void
  onSubmit: () => void
  isSaving: boolean
}) {
  const { t } = useDashboardUi()
  const { open, onOpenChange, newProduct, setNewProduct, setImageFile, onSubmit, isSaving } = props

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t.products.addProduct}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.products.addNewProduct}</DialogTitle>
          <DialogDescription>{t.products.addNewProductDesc}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2"><Label htmlFor="name">{t.products.name}</Label><Input id="name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder={t.products.namePlaceholder} /></div>
          <div className="space-y-2"><Label htmlFor="description">{t.products.description}</Label><Input id="description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder={t.products.descriptionPlaceholder} /></div>
          <div className="space-y-2"><Label htmlFor="image">Image</Label><Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} /></div>
          <div className="space-y-2"><Label htmlFor="price">{t.products.price}</Label><Input id="price" type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="0.00" /></div>
          <div className="space-y-2">
            <Label htmlFor="category">{t.products.category}</Label>
            <Select value={newProduct.category} onValueChange={(value: "cookies" | "brownies") => setNewProduct({ ...newProduct, category: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cookies">{t.products.cookies}</SelectItem>
                <SelectItem value="brownies">{t.products.brownies}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Canales</Label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Checkbox id="new-channel-ecommerce" checked={newProduct.channels.includes("ecommerce")} onCheckedChange={(checked) => {
                  const current = new Set(newProduct.channels)
                  checked ? current.add("ecommerce") : current.delete("ecommerce")
                  setNewProduct({ ...newProduct, channels: Array.from(current) as Array<"ecommerce" | "pos"> })
                }} />
                <Label htmlFor="new-channel-ecommerce">Ecommerce</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="new-channel-pos" checked={newProduct.channels.includes("pos")} onCheckedChange={(checked) => {
                  const current = new Set(newProduct.channels)
                  checked ? current.add("pos") : current.delete("pos")
                  setNewProduct({ ...newProduct, channels: Array.from(current) as Array<"ecommerce" | "pos"> })
                }} />
                <Label htmlFor="new-channel-pos">POS</Label>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="new-seasonal-valentin" checked={Boolean(newProduct.isSeasonal)} onCheckedChange={(checked) => setNewProduct({ ...newProduct, isSeasonal: Boolean(checked), seasonKey: checked ? "valentin" : null })} />
            <Label htmlFor="new-seasonal-valentin">Especiales de Febrero</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="bg-transparent" onClick={() => onOpenChange(false)}>{t.products.cancel}</Button>
          <Button onClick={onSubmit} disabled={isSaving}>{isSaving ? "Saving..." : t.products.add}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

