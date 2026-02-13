"use client"

import type { Product } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/format-price"
import Image from "next/image"
import { Pencil, Star } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboardUi } from "@/components/dashboard/dashboard-ui-context"

export function ProductCard(props: {
  product: Product
  editingProduct: Product | null
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  setEditingProduct: (value: Product | null) => void
  setEditProductImageFile: (file: File | null) => void
  isSavingProduct: boolean
  onEditProduct: () => void
  onRequestReactivate: (product: Product) => void
  onHideProduct: (product: Product) => void
}) {
  const {
    product,
    editingProduct,
    isEditDialogOpen,
    setIsEditDialogOpen,
    setEditingProduct,
    setEditProductImageFile,
    isSavingProduct,
    onEditProduct,
    onRequestReactivate,
    onHideProduct,
  } = props
  const { t } = useDashboardUi()
  const isHidden = !product.channels || product.channels.length === 0

  return (
    <Card className={cn("border-border/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md", isHidden && "bg-muted/50 text-muted-foreground opacity-70")}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-28 h-36 sm:h-24 rounded-xl overflow-hidden bg-muted shrink-0">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={product.category === "cookies" ? "default" : "secondary"}>{product.category === "cookies" ? t.products.cookie : t.products.brownie}</Badge>
              {product.featured && <Badge variant="secondary" className="bg-amber-100 text-amber-800 gap-1"><Star className="h-3 w-3" />Featured</Badge>}
              {isHidden && <Badge variant="outline" className="border-muted-foreground/40 text-muted-foreground">Oculto</Badge>}
              {(product.channels ?? []).includes("ecommerce") && <Badge variant="outline">Ecommerce</Badge>}
              {(product.channels ?? []).includes("pos") && <Badge variant="outline">POS</Badge>}
              {product.isSeasonal && product.seasonKey === "valentin" && <Badge variant="secondary" className="bg-pink-100 text-pink-800">San Valentín</Badge>}
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              </div>
              <span className="font-semibold text-primary whitespace-nowrap">{formatPrice(product.price)}</span>
            </div>
          </div>
          <div className="flex sm:flex-col gap-2 shrink-0">
            <Dialog
              open={isEditDialogOpen && editingProduct?.id === product.id}
              onOpenChange={(open) => {
                setIsEditDialogOpen(open)
                if (!open) setEditingProduct(null)
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent" onClick={() => setEditingProduct(product)}>
                  <Pencil className="h-4 w-4 sm:mr-0 mr-2" />
                  <span className="sm:hidden">{t.products.edit}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.products.editProduct}</DialogTitle>
                  <DialogDescription>{t.products.editProductDesc}</DialogDescription>
                </DialogHeader>
                {editingProduct && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2"><Label htmlFor="edit-name">{t.products.name}</Label><Input id="edit-name" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} /></div>
                    <div className="space-y-2"><Label htmlFor="edit-description">{t.products.description}</Label><Input id="edit-description" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} /></div>
                    <div className="space-y-2"><Label htmlFor="edit-image">Image</Label><Input id="edit-image" type="file" accept="image/*" onChange={(e) => setEditProductImageFile(e.target.files?.[0] ?? null)} /></div>
                    <div className="space-y-2"><Label htmlFor="edit-price">{t.products.price}</Label><Input id="edit-price" type="number" step="0.01" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })} /></div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">{t.products.category}</Label>
                      <Select value={editingProduct.category} onValueChange={(value: "cookies" | "brownies") => setEditingProduct({ ...editingProduct, category: value })}>
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
                          <Checkbox
                            id="edit-channel-ecommerce"
                            checked={(editingProduct.channels ?? ["ecommerce", "pos"]).includes("ecommerce")}
                            onCheckedChange={(checked) => {
                              const current = new Set(editingProduct.channels ?? ["ecommerce", "pos"])
                              checked ? current.add("ecommerce") : current.delete("ecommerce")
                              setEditingProduct({ ...editingProduct, channels: Array.from(current) as Array<"ecommerce" | "pos"> })
                            }}
                          />
                          <Label htmlFor="edit-channel-ecommerce">Ecommerce</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="edit-channel-pos"
                            checked={(editingProduct.channels ?? ["ecommerce", "pos"]).includes("pos")}
                            onCheckedChange={(checked) => {
                              const current = new Set(editingProduct.channels ?? ["ecommerce", "pos"])
                              checked ? current.add("pos") : current.delete("pos")
                              setEditingProduct({ ...editingProduct, channels: Array.from(current) as Array<"ecommerce" | "pos"> })
                            }}
                          />
                          <Label htmlFor="edit-channel-pos">POS</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2"><Checkbox id="edit-seasonal-valentin" checked={Boolean(editingProduct.isSeasonal)} onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, isSeasonal: Boolean(checked), seasonKey: checked ? "valentin" : null })} /><Label htmlFor="edit-seasonal-valentin">San Valentín</Label></div>
                    <div className="flex items-center gap-2"><Checkbox id="edit-featured" checked={Boolean(editingProduct.featured)} onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, featured: Boolean(checked) })} /><Label htmlFor="edit-featured">Featured</Label></div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" className="bg-transparent" onClick={() => setIsEditDialogOpen(false)}>{t.products.cancel}</Button>
                  <Button onClick={onEditProduct} disabled={isSavingProduct}>{isSavingProduct ? "Saving..." : t.products.save}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {isHidden ? (
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent" onClick={() => onRequestReactivate(product)}>Reactivar</Button>
            ) : (
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-muted-foreground bg-transparent" onClick={() => onHideProduct(product)}>Ocultar</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

