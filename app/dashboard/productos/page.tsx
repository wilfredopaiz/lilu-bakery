"use client"

import { useMemo, useState } from "react"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cookie, Square } from "lucide-react"
import { useProducts } from "@/hooks/dashboard/use-products"
import { useDashboardUi } from "@/components/dashboard/dashboard-ui-context"
import { ProductFormDialog } from "@/components/dashboard/products/product-form-dialog"
import { ProductsFilters } from "@/components/dashboard/products/products-filters"
import { ProductCard } from "@/components/dashboard/products/product-card"

export default function DashboardProductsPage() {
  const { t } = useDashboardUi()
  const { productList, isSavingProduct, addProduct, editProduct, softHideProduct, restoreProduct } = useProducts()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProductImageFile, setNewProductImageFile] = useState<File | null>(null)
  const [editProductImageFile, setEditProductImageFile] = useState<File | null>(null)
  const [isReactivateDialogOpen, setIsReactivateDialogOpen] = useState(false)
  const [reactivateProductId, setReactivateProductId] = useState<string | null>(null)

  const [productsPageSize, setProductsPageSize] = useState(8)
  const [hideHiddenProducts, setHideHiddenProducts] = useState(true)
  const [cookiePage, setCookiePage] = useState(1)
  const [browniePage, setBrowniePage] = useState(1)

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "cookies" as "cookies" | "brownies",
    channels: ["ecommerce", "pos"] as Array<"ecommerce" | "pos">,
    isSeasonal: false,
    seasonKey: "valentin" as string | null,
  })

  const baseCookieProducts = useMemo(() => productList.filter((p) => p.category === "cookies"), [productList])
  const baseBrownieProducts = useMemo(() => productList.filter((p) => p.category === "brownies"), [productList])
  const cookieProducts = useMemo(() => hideHiddenProducts ? baseCookieProducts.filter((p) => (p.channels ?? []).length > 0) : baseCookieProducts, [baseCookieProducts, hideHiddenProducts])
  const brownieProducts = useMemo(() => hideHiddenProducts ? baseBrownieProducts.filter((p) => (p.channels ?? []).length > 0) : baseBrownieProducts, [baseBrownieProducts, hideHiddenProducts])

  const cookieTotalPages = Math.max(1, Math.ceil(cookieProducts.length / productsPageSize))
  const brownieTotalPages = Math.max(1, Math.ceil(brownieProducts.length / productsPageSize))
  const pagedCookieProducts = cookieProducts.slice((cookiePage - 1) * productsPageSize, cookiePage * productsPageSize)
  const pagedBrownieProducts = brownieProducts.slice((browniePage - 1) * productsPageSize, browniePage * productsPageSize)

  const handleAddProduct = async () => {
    const ok = await addProduct({ ...newProduct, imageFile: newProductImageFile })
    if (!ok) return
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "cookies",
      channels: ["ecommerce", "pos"],
      isSeasonal: false,
      seasonKey: "valentin",
    })
    setNewProductImageFile(null)
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = async () => {
    if (!editingProduct) return
    const ok = await editProduct(editingProduct, editProductImageFile)
    if (!ok) return
    setIsEditDialogOpen(false)
    setEditingProduct(null)
    setEditProductImageFile(null)
  }

  const requestReactivateProduct = (product: Product) => {
    setReactivateProductId(product.id)
    setIsReactivateDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">{t.products.title}</h1>
          <p className="text-muted-foreground text-sm">{productList.length} {t.products.totalCount}</p>
        </div>
        <ProductsFilters
          pageSize={productsPageSize}
          setPageSize={setProductsPageSize}
          hideHidden={hideHiddenProducts}
          setHideHidden={setHideHiddenProducts}
          resetPages={() => {
            setCookiePage(1)
            setBrowniePage(1)
          }}
        />
        <ProductFormDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          setImageFile={setNewProductImageFile}
          onSubmit={handleAddProduct}
          isSaving={isSavingProduct}
        />
      </div>

      <Tabs defaultValue="cookies" className="space-y-4">
        <TabsList className="flex w-fit">
          <TabsTrigger value="cookies" className="gap-2"><Cookie className="h-4 w-4" />{t.products.cookies}</TabsTrigger>
          <TabsTrigger value="brownies" className="gap-2"><Square className="h-4 w-4" />{t.products.brownies}</TabsTrigger>
        </TabsList>

        <TabsContent value="cookies" className="space-y-4">
          <p className="text-sm text-muted-foreground">{cookieProducts.length} {t.products.totalCount}</p>
          <div className="grid gap-4">
            {pagedCookieProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                editingProduct={editingProduct}
                isEditDialogOpen={isEditDialogOpen}
                setIsEditDialogOpen={setIsEditDialogOpen}
                setEditingProduct={setEditingProduct}
                setEditProductImageFile={setEditProductImageFile}
                isSavingProduct={isSavingProduct}
                onEditProduct={handleEditProduct}
                onRequestReactivate={requestReactivateProduct}
                onHideProduct={softHideProduct}
              />
            ))}
            {cookieProducts.length === 0 && <p className="text-muted-foreground text-center py-8">No cookies available</p>}
          </div>
          {cookieProducts.length > productsPageSize && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" className="bg-transparent" onClick={() => setCookiePage((prev) => Math.max(1, prev - 1))} disabled={cookiePage === 1}>Anterior</Button>
              <span className="text-sm text-muted-foreground">Página {cookiePage} de {cookieTotalPages}</span>
              <Button variant="outline" className="bg-transparent" onClick={() => setCookiePage((prev) => Math.min(cookieTotalPages, prev + 1))} disabled={cookiePage === cookieTotalPages}>Siguiente</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="brownies" className="space-y-4">
          <p className="text-sm text-muted-foreground">{brownieProducts.length} {t.products.totalCount}</p>
          <div className="grid gap-4">
            {pagedBrownieProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                editingProduct={editingProduct}
                isEditDialogOpen={isEditDialogOpen}
                setIsEditDialogOpen={setIsEditDialogOpen}
                setEditingProduct={setEditingProduct}
                setEditProductImageFile={setEditProductImageFile}
                isSavingProduct={isSavingProduct}
                onEditProduct={handleEditProduct}
                onRequestReactivate={requestReactivateProduct}
                onHideProduct={softHideProduct}
              />
            ))}
            {brownieProducts.length === 0 && <p className="text-muted-foreground text-center py-8">No brownies available</p>}
          </div>
          {brownieProducts.length > productsPageSize && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" className="bg-transparent" onClick={() => setBrowniePage((prev) => Math.max(1, prev - 1))} disabled={browniePage === 1}>Anterior</Button>
              <span className="text-sm text-muted-foreground">Página {browniePage} de {brownieTotalPages}</span>
              <Button variant="outline" className="bg-transparent" onClick={() => setBrowniePage((prev) => Math.min(brownieTotalPages, prev + 1))} disabled={browniePage === brownieTotalPages}>Siguiente</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={isReactivateDialogOpen} onOpenChange={setIsReactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivar producto</AlertDialogTitle>
            <AlertDialogDescription>
              Reactivar este producto lo hará aparecer en todos los canales (Ecommerce, POS, etc.). Para ajustar los canales, edita el producto manualmente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReactivateProductId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!reactivateProductId) return
                await restoreProduct(reactivateProductId)
                setReactivateProductId(null)
              }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

