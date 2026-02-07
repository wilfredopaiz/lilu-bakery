"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Order, Product } from "@/lib/types"
import { formatPrice } from "@/lib/format-price"
import { getTranslations, type Language } from "@/lib/i18n"
import {
  Package,
  ShoppingCart,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  LogOut,
  Home,
  Globe,
  Cookie,
  Square,
  Star,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase/client"
import type { Session } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"

type Translations = ReturnType<typeof getTranslations>

interface DashboardProductCardProps {
  product: Product
  t: Translations
  editingProduct: Product | null
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  setEditingProduct: (product: Product | null) => void
  setEditProductImageFile: (file: File | null) => void
  isSavingProduct: boolean
  handleEditProduct: () => void
  handleDeleteProduct: (id: string) => void
}

function DashboardProductCard({
  product,
  t,
  editingProduct,
  isEditDialogOpen,
  setIsEditDialogOpen,
  setEditingProduct,
  setEditProductImageFile,
  isSavingProduct,
  handleEditProduct,
  handleDeleteProduct,
}: DashboardProductCardProps) {
  return (
    <Card className="border-border/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-28 h-36 sm:h-24 rounded-xl overflow-hidden bg-muted shrink-0">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={product.category === "cookies" ? "default" : "secondary"}>
                {product.category === "cookies" ? t.products.cookie : t.products.brownie}
              </Badge>
              {product.featured && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 gap-1">
                  <Star className="h-3 w-3" />
                  Featured
                </Badge>
              )}
              {(product.channels ?? ["ecommerce", "pos"]).includes("ecommerce") && (
                <Badge variant="outline">Ecommerce</Badge>
              )}
              {(product.channels ?? ["ecommerce", "pos"]).includes("pos") && (
                <Badge variant="outline">POS</Badge>
              )}
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
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none bg-transparent"
                  onClick={() => setEditingProduct(product)}
                >
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
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">{t.products.name}</Label>
                      <Input
                        id="edit-name"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">{t.products.description}</Label>
                      <Input
                        id="edit-description"
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-image">Image</Label>
                      <Input
                        id="edit-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditProductImageFile(e.target.files?.[0] ?? null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-price">{t.products.price}</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        step="0.01"
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">{t.products.category}</Label>
                    <Select
                      value={editingProduct.category}
                      onValueChange={(value: "cookies" | "brownies") =>
                        setEditingProduct({ ...editingProduct, category: value })
                      }
                    >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
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
                            if (checked) {
                              current.add("ecommerce")
                            } else {
                              current.delete("ecommerce")
                            }
                            setEditingProduct({ ...editingProduct, channels: Array.from(current) as any })
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
                            if (checked) {
                              current.add("pos")
                            } else {
                              current.delete("pos")
                            }
                            setEditingProduct({ ...editingProduct, channels: Array.from(current) as any })
                          }}
                        />
                        <Label htmlFor="edit-channel-pos">POS</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="edit-featured"
                        checked={Boolean(editingProduct.featured)}
                        onCheckedChange={(checked) =>
                          setEditingProduct({ ...editingProduct, featured: Boolean(checked) })
                        }
                      />
                      <Label htmlFor="edit-featured">Featured</Label>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" className="bg-transparent" onClick={() => setIsEditDialogOpen(false)}>
                    {t.products.cancel}
                  </Button>
                  <Button onClick={handleEditProduct} disabled={isSavingProduct}>
                    {isSavingProduct ? "Saving..." : t.products.save}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none text-destructive hover:text-destructive bg-transparent"
              onClick={() => handleDeleteProduct(product.id)}
            >
              <Trash2 className="h-4 w-4 sm:mr-0 mr-2" />
              <span className="sm:hidden">{t.products.delete}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [language, setLanguage] = useState<Language>("es")
  const t = getTranslations(language)
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const { toast } = useToast()

  const [productList, setProductList] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "cookies" as "cookies" | "brownies",
    image: "",
    channels: ["ecommerce", "pos"] as Array<"ecommerce" | "pos">,
  })
  const [newProductImageFile, setNewProductImageFile] = useState<File | null>(null)
  const [editProductImageFile, setEditProductImageFile] = useState<File | null>(null)
  const [isSavingProduct, setIsSavingProduct] = useState(false)
  const [posCustomerName, setPosCustomerName] = useState("")
  const [posPhoneNumber, setPosPhoneNumber] = useState("")
  const [posItems, setPosItems] = useState<
    Array<{ product: Product; quantity: number }>
  >([])
  const [isSavingPosOrder, setIsSavingPosOrder] = useState(false)
  const [isEditingPosOrder, setIsEditingPosOrder] = useState(false)
  const [posEditOrder, setPosEditOrder] = useState<Order | null>(null)
  const [posEditItems, setPosEditItems] = useState<Array<{ product: Product; quantity: number }>>([])
  const [posEditCustomerName, setPosEditCustomerName] = useState("")
  const [posEditPhoneNumber, setPosEditPhoneNumber] = useState("")

  useEffect(() => {
    let isMounted = true

    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session)
        setAuthChecked(true)
      }
    })

    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setAuthChecked(true)
    })

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (authChecked && !session) {
      router.push("/login")
    }
  }, [authChecked, session, router])

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      const response = await fetch("/api/admin/products")
      if (!response.ok) return
      const payload = await response.json()
      const data = payload.products || []

      if (isMounted) {
        setProductList(data as Product[])
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const loadOrders = async (isMountedRef?: { current: boolean }) => {
    if (!session) return

    const response = await fetch("/api/admin/orders")
    if (!response.ok) return

    const payload = await response.json()
    const data = payload.orders || []

    if (isMountedRef?.current === false) return

    const mapped = data.map((order: any) => ({
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      phoneNumber: order.phone_number,
      status: order.status,
      origin: order.origin,
      total: order.total,
      createdAt: order.created_at,
      items: (order.order_items || []).map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        price: item.unit_price,
        lineTotal: item.line_total,
      })),
    }))
    setOrders(mapped as Order[])
  }

  useEffect(() => {
    const isMountedRef = { current: true }
    loadOrders(isMountedRef)
    return () => {
      isMountedRef.current = false
    }
  }, [session])

  const ecommerceProducts = productList.filter((p) => (p.channels ?? ["ecommerce", "pos"]).includes("ecommerce"))
  const posProducts = productList.filter((p) => (p.channels ?? ["ecommerce", "pos"]).includes("pos"))
  const cookieProducts = productList.filter((p) => p.category === "cookies")
  const brownieProducts = productList.filter((p) => p.category === "brownies")

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    )
  }

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    })
    if (!response.ok) {
      throw new Error("Failed to upload image")
    }
    const payload = await response.json()
    return payload.url as string
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProductImageFile) {
      toast({
        title: "Faltan datos",
        description: "Nombre, descripción, precio e imagen son obligatorios.",
        variant: "destructive",
      })
      return
    }
    if (newProduct.channels.length === 0) {
      toast({
        title: "Selecciona canales",
        description: "Elige al menos un canal de venta (Ecommerce o POS).",
        variant: "destructive",
      })
      return
    }
    setIsSavingProduct(true)
    try {
      const imageUrl = await uploadImage(newProductImageFile)
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          category: newProduct.category,
          image: imageUrl,
          channels: newProduct.channels,
        }),
      })
      if (!response.ok) return
      const payload = await response.json()
      setProductList([...productList, payload.product as Product])
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "cookies",
        image: "",
        channels: ["ecommerce", "pos"],
      })
      setNewProductImageFile(null)
      setIsAddDialogOpen(false)
      toast({
        title: "Producto creado",
        description: "El producto se guardó correctamente.",
      })
    } finally {
      setIsSavingProduct(false)
    }
  }

  const handleEditProduct = async () => {
    if (!editingProduct) return
    if (!editingProduct.description || !editingProduct.name || !editingProduct.price) {
      toast({
        title: "Faltan datos",
        description: "Nombre, descripción y precio son obligatorios.",
        variant: "destructive",
      })
      return
    }
    if (!editingProduct.channels || editingProduct.channels.length === 0) {
      toast({
        title: "Selecciona canales",
        description: "Elige al menos un canal de venta (Ecommerce o POS).",
        variant: "destructive",
      })
      return
    }
    setIsSavingProduct(true)
    try {
      let imageUrl = editingProduct.image
      if (editProductImageFile) {
        imageUrl = await uploadImage(editProductImageFile)
      }

      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          category: editingProduct.category,
          image: imageUrl,
          featured: Boolean(editingProduct.featured),
          channels: editingProduct.channels ?? ["ecommerce", "pos"],
        }),
      })
      if (!response.ok) return
      const payload = await response.json()
      setProductList(
        productList.map((p) => (p.id === editingProduct.id ? (payload.product as Product) : p))
      )
      setIsEditDialogOpen(false)
      setEditingProduct(null)
      setEditProductImageFile(null)
      toast({
        title: "Producto actualizado",
        description: "El producto se guardó correctamente.",
      })
    } finally {
      setIsSavingProduct(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?")
    if (!confirmed) return
    const response = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (!response.ok) return
    setProductList(productList.filter((p) => p.id !== id))
  }

  const handleChangeOrderStatus = async (
    orderId: string,
    newStatus: "paid" | "pending" | "abandoned" | "cancelled"
  ) => {
    setOrders(
      orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    )

    await supabaseBrowser.from("orders").update({ status: newStatus }).eq("id", orderId)
  }

  const getTotalProducts = (order: Order) => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const addPosItem = (product: Product) => {
    setPosItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updatePosQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setPosItems((prev) => prev.filter((item) => item.product.id !== productId))
      return
    }
    setPosItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const posSubtotal = posItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const posEditSubtotal = posEditItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const handleCreatePosOrder = async () => {
    if (posItems.length === 0) return
    setIsSavingPosOrder(true)
    try {
      const response = await fetch("/api/admin/pos-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: posCustomerName,
          phoneNumber: posPhoneNumber,
          currency: "HNL",
          items: posItems.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      })
      if (!response.ok) {
        toast({
          title: "Error al guardar",
          description: "No se pudo registrar la venta POS.",
          variant: "destructive",
        })
        return
      }
      setPosCustomerName("")
      setPosPhoneNumber("")
      setPosItems([])
      await loadOrders()
      toast({
        title: "Venta registrada",
        description: "La venta POS se guardó correctamente.",
      })
    } finally {
      setIsSavingPosOrder(false)
    }
  }

  const openPosEdit = (order: Order) => {
    const items = order.items
      .map((item) => {
        const product = productList.find((p) => p.id === item.productId)
        if (!product) return null
        return { product, quantity: item.quantity }
      })
      .filter(Boolean) as Array<{ product: Product; quantity: number }>

    setPosEditOrder(order)
    setPosEditItems(items)
    setPosEditCustomerName(order.customerName)
    setPosEditPhoneNumber(order.phoneNumber)
    setIsEditingPosOrder(true)
  }

  const updatePosEditQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setPosEditItems((prev) => prev.filter((item) => item.product.id !== productId))
      return
    }
    setPosEditItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const handleSavePosEdit = async () => {
    if (!posEditOrder) return
    setIsSavingPosOrder(true)
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: posEditOrder.id,
          customerName: posEditCustomerName || "Cliente POS",
          phoneNumber: posEditPhoneNumber || "0",
          items: posEditItems.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      })
      if (!response.ok) {
        toast({
          title: "Error al actualizar",
          description: "No se pudo actualizar la venta POS.",
          variant: "destructive",
        })
        return
      }
      setIsEditingPosOrder(false)
      setPosEditOrder(null)
      setPosEditItems([])
      await loadOrders()
      toast({
        title: "Venta actualizada",
        description: "Los cambios se guardaron correctamente.",
      })
    } finally {
      setIsSavingPosOrder(false)
    }
  }

  const handleCancelPosOrder = async (orderId: string) => {
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status: "cancelled" }),
    })
    if (!response.ok) {
      toast({
        title: "Error al cancelar",
        description: "No se pudo cancelar la venta.",
        variant: "destructive",
      })
      return
    }
    await loadOrders()
    toast({
      title: "Venta cancelada",
      description: "La venta se marcó como cancelada.",
    })
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-2xl font-bold text-primary">
              Lilu's Bakery
            </Link>
            <Badge variant="secondary">{t.dashboard.badge}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {language === "es" ? t.language.spanish : t.language.english}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("es")}>
                  {t.language.spanish}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  {t.language.english}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t.dashboard.viewStore}</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await supabaseBrowser.auth.signOut()
                router.push("/login")
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t.dashboard.logout}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">{t.dashboard.title}</h1>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t.dashboard.title}
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t.tabs.products}
            </TabsTrigger>
            <TabsTrigger value="pos" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              POS
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              {t.tabs.orders}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{t.dashboard.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Resumen de ventas y productos
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-5 space-y-1">
                  <p className="text-sm text-muted-foreground">Ventas pagadas</p>
                  <p className="text-2xl font-semibold">
                    {formatPrice(
                      orders
                        .filter((order) => order.status === "paid")
                        .reduce((sum, order) => sum + order.total, 0)
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 space-y-1">
                  <p className="text-sm text-muted-foreground">Ventas pendientes</p>
                  <p className="text-2xl font-semibold">
                    {formatPrice(
                      orders
                        .filter((order) => order.status === "pending")
                        .reduce((sum, order) => sum + order.total, 0)
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 space-y-1">
                  <p className="text-sm text-muted-foreground">Órdenes</p>
                  <p className="text-2xl font-semibold">{orders.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 space-y-1">
                  <p className="text-sm text-muted-foreground">Productos</p>
                  <p className="text-2xl font-semibold">{productList.length}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Órdenes por estado</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
                  <span className="text-sm text-muted-foreground">{t.orders.paid}</span>
                  <span className="text-sm font-semibold">
                    {orders.filter((order) => order.status === "paid").length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
                  <span className="text-sm text-muted-foreground">{t.orders.pending}</span>
                  <span className="text-sm font-semibold">
                    {orders.filter((order) => order.status === "pending").length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
                  <span className="text-sm text-muted-foreground">{t.orders.abandoned}</span>
                  <span className="text-sm font-semibold">
                    {orders.filter((order) => order.status === "abandoned").length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
                  <span className="text-sm text-muted-foreground">{t.orders.cancelled}</span>
                  <span className="text-sm font-semibold">
                    {orders.filter((order) => order.status === "cancelled").length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Últimas Órdenes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.phoneNumber}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">
                          {formatPrice(order.total)}
                        </span>
                        {order.phoneNumber !== "0" && (
                          <Button variant="outline" size="sm" className="bg-transparent" asChild>
                            <Link
                              href={`https://wa.me/${order.phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
                                `Hola ${order.customerName}, seguimos tu pedido. Orden: ${order.orderNumber ?? order.id}`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-sm text-muted-foreground">Sin órdenes aún.</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Productos destacados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {productList
                    .filter((product) => product.featured)
                    .slice(0, 5)
                    .map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <p className="text-sm font-medium">{product.name}</p>
                        <span className="text-sm text-muted-foreground">{formatPrice(product.price)}</span>
                      </div>
                    ))}
                  {productList.filter((product) => product.featured).length === 0 && (
                    <p className="text-sm text-muted-foreground">Sin productos destacados.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{t.products.title}</h2>
                <p className="text-muted-foreground text-sm">
                  {productList.length} {t.products.totalCount}
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.products.name}</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder={t.products.namePlaceholder}
                      />
                    </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t.products.description}</Label>
                    <Input
                      id="description"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, description: e.target.value })
                      }
                      placeholder={t.products.descriptionPlaceholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewProductImageFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">{t.products.price}</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">{t.products.category}</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value: "cookies" | "brownies") =>
                        setNewProduct({ ...newProduct, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                          id="new-channel-ecommerce"
                          checked={newProduct.channels.includes("ecommerce")}
                          onCheckedChange={(checked) => {
                            const current = new Set(newProduct.channels)
                            if (checked) {
                              current.add("ecommerce")
                            } else {
                              current.delete("ecommerce")
                            }
                            setNewProduct({ ...newProduct, channels: Array.from(current) as any })
                          }}
                        />
                        <Label htmlFor="new-channel-ecommerce">Ecommerce</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="new-channel-pos"
                          checked={newProduct.channels.includes("pos")}
                          onCheckedChange={(checked) => {
                            const current = new Set(newProduct.channels)
                            if (checked) {
                              current.add("pos")
                            } else {
                              current.delete("pos")
                            }
                            setNewProduct({ ...newProduct, channels: Array.from(current) as any })
                          }}
                        />
                        <Label htmlFor="new-channel-pos">POS</Label>
                      </div>
                    </div>
                  </div>
                  </div>
                  <DialogFooter>
                  <Button
                    variant="outline"
                    className="bg-transparent"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    {t.products.cancel}
                  </Button>
                  <Button onClick={handleAddProduct} disabled={isSavingProduct}>
                    {isSavingProduct ? "Saving..." : t.products.add}
                  </Button>
                </DialogFooter>
              </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="cookies" className="space-y-4">
              <TabsList className="flex w-fit">
                <TabsTrigger value="cookies" className="gap-2">
                  <Cookie className="h-4 w-4" />
                  {t.products.cookies}
                </TabsTrigger>
                <TabsTrigger value="brownies" className="gap-2">
                  <Square className="h-4 w-4" />
                  {t.products.brownies}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cookies" className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {cookieProducts.length} {t.products.totalCount}
                  </p>
                </div>
                <div className="grid gap-4">
                  {cookieProducts.map((product) => (
                    <DashboardProductCard
                      key={product.id}
                      product={product}
                      t={t}
                      editingProduct={editingProduct}
                      isEditDialogOpen={isEditDialogOpen}
                      setIsEditDialogOpen={setIsEditDialogOpen}
                      setEditingProduct={setEditingProduct}
                      setEditProductImageFile={setEditProductImageFile}
                      isSavingProduct={isSavingProduct}
                      handleEditProduct={handleEditProduct}
                      handleDeleteProduct={handleDeleteProduct}
                    />
                  ))}
                  {cookieProducts.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No cookies available</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="brownies" className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {brownieProducts.length} {t.products.totalCount}
                  </p>
                </div>
                <div className="grid gap-4">
                  {brownieProducts.map((product) => (
                    <DashboardProductCard
                      key={product.id}
                      product={product}
                      t={t}
                      editingProduct={editingProduct}
                      isEditDialogOpen={isEditDialogOpen}
                      setIsEditDialogOpen={setIsEditDialogOpen}
                      setEditingProduct={setEditingProduct}
                      setEditProductImageFile={setEditProductImageFile}
                      isSavingProduct={isSavingProduct}
                      handleEditProduct={handleEditProduct}
                      handleDeleteProduct={handleDeleteProduct}
                    />
                  ))}
                  {brownieProducts.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No brownies available</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* POS Tab */}
          <TabsContent value="pos" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">POS</h2>
                <p className="text-sm text-muted-foreground">
                  Registra ventas físicas con los productos existentes.
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Productos</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {posProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addPosItem(product)}
                      className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3 text-left transition hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {product.category === "cookies" ? t.products.cookie : t.products.brownie}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                  {productList.length === 0 && (
                    <p className="text-sm text-muted-foreground">No hay productos disponibles.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Nueva venta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pos-customer">Cliente</Label>
                    <Input
                      id="pos-customer"
                      value={posCustomerName}
                      onChange={(e) => setPosCustomerName(e.target.value)}
                      placeholder="Nombre del cliente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pos-phone">Teléfono</Label>
                    <Input
                      id="pos-phone"
                      value={posPhoneNumber}
                      onChange={(e) => setPosPhoneNumber(e.target.value)}
                      placeholder="Número de teléfono"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                    <span className="text-sm text-muted-foreground">Estado</span>
                    <span className="text-sm font-semibold">{t.orders.paid}</span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Items</p>
                    {posItems.length === 0 && (
                      <p className="text-sm text-muted-foreground">Agrega productos a la venta.</p>
                    )}
                    {posItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">{formatPrice(item.product.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updatePosQuantity(item.product.id, Number(e.target.value))
                            }
                            className="h-8 w-16"
                          />
                          <span className="text-sm font-semibold">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => updatePosQuantity(item.product.id, 0)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-sm font-semibold">{formatPrice(posSubtotal)}</span>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleCreatePosOrder}
                    disabled={isSavingPosOrder || posItems.length === 0}
                  >
                    {isSavingPosOrder ? "Guardando..." : "Registrar venta"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

                    {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Ventas</h2>
              <p className="text-muted-foreground text-sm">
                {orders.length} {t.orders.totalCount}
              </p>
            </div>

            <Tabs defaultValue="web" className="space-y-4">
              <TabsList className="flex w-fit">
                <TabsTrigger value="web">Pedidos Web</TabsTrigger>
                <TabsTrigger value="pos">Ventas POS</TabsTrigger>
              </TabsList>

              <TabsContent value="web" className="space-y-4">
                <div className="space-y-4">
                  {orders
                    .filter((order) => order.origin !== "pos")
                    .map((order) => (
                      <Collapsible
                        key={order.id}
                        open={expandedOrders.includes(order.id)}
                        onOpenChange={() => toggleOrderExpanded(order.id)}
                      >
                        <Card>
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                  <div>
                                    <CardTitle className="text-base">{order.customerName}</CardTitle>
                                    <CardDescription>{order.phoneNumber}</CardDescription>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge
                                    variant="secondary"
                                    className={
                                      order.status === "paid"
                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                        : order.status === "pending"
                                          ? "bg-amber-500 hover:bg-amber-600 text-white"
                                          : order.status === "abandoned"
                                            ? "bg-slate-400 hover:bg-slate-500 text-white"
                                            : "bg-red-500 hover:bg-red-600 text-white"
                                    }
                                  >
                                    {order.status === "paid"
                                      ? t.orders.paid
                                      : order.status === "pending"
                                        ? t.orders.pending
                                        : order.status === "abandoned"
                                          ? t.orders.abandoned
                                          : t.orders.cancelled}
                                  </Badge>
                                  <Badge variant="outline">Ecommerce</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {getTotalProducts(order)} {t.orders.products}
                                  </span>
                                  <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                                  {expandedOrders.includes(order.id) ? (
                                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <div className="border-t pt-4 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <h4 className="font-medium">{t.orders.orderDetail}</h4>
                                  <div className="flex items-center gap-2">
                                    {order.phoneNumber !== "0" && (
                                      <Button variant="outline" size="sm" className="bg-transparent" asChild>
                                        <Link
                                          href={`https://wa.me/${order.phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
                                            `Hola ${order.customerName}, seguimos tu pedido. Orden: ${order.orderNumber ?? order.id}`
                                          )}`}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          <MessageCircle className="h-4 w-4 mr-2" />
                                          WhatsApp
                                        </Link>
                                      </Button>
                                    )}
                                    <span className="text-sm text-muted-foreground">
                                      {t.orders.changeStatus}:
                                    </span>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="bg-transparent">
                                          {order.status === "paid"
                                            ? t.orders.paid
                                            : order.status === "pending"
                                              ? t.orders.pending
                                              : order.status === "abandoned"
                                                ? t.orders.abandoned
                                                : t.orders.cancelled}
                                          <ChevronDown className="h-4 w-4 ml-2" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleChangeOrderStatus(order.id, "paid")
                                          }}
                                        >
                                          {t.orders.markAsPaid}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleChangeOrderStatus(order.id, "pending")
                                          }}
                                        >
                                          {t.orders.markAsPending}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleChangeOrderStatus(order.id, "abandoned")
                                          }}
                                        >
                                          {t.orders.abandoned}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleChangeOrderStatus(order.id, "cancelled")
                                          }}
                                        >
                                          {t.orders.cancelled}
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>{t.orders.product}</TableHead>
                                        <TableHead className="text-center">{t.orders.quantity}</TableHead>
                                        <TableHead className="text-right">{t.orders.unitPrice}</TableHead>
                                        <TableHead className="text-right">{t.orders.subtotal}</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {order.items.map((item, index) => (
                                        <TableRow key={index}>
                                          <TableCell className="font-medium">{item.productName}</TableCell>
                                          <TableCell className="text-center">{item.quantity}</TableCell>
                                          <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                                          <TableCell className="text-right">
                                            {formatPrice(item.price * item.quantity)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                      <TableRow>
                                        <TableCell colSpan={3} className="text-right font-medium text-muted-foreground">
                                          Subtotal
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-muted-foreground">
                                          {formatPrice(
                                            order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
                                          )}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell colSpan={3} className="text-right font-medium text-muted-foreground">
                                          Envio
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-muted-foreground">
                                          {formatPrice(120)}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell colSpan={3} className="text-right font-bold">
                                          {t.orders.total}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-primary">
                                          {formatPrice(order.total)}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="pos" className="space-y-4">
                <div className="space-y-4">
                  {orders
                    .filter((order) => order.origin === "pos")
                    .map((order) => (
                      <Collapsible
                        key={order.id}
                        open={expandedOrders.includes(order.id)}
                        onOpenChange={() => toggleOrderExpanded(order.id)}
                      >
                        <Card>
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                  <div>
                                    <CardTitle className="text-base">{order.customerName}</CardTitle>
                                    <CardDescription>{order.phoneNumber}</CardDescription>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge
                                    variant="secondary"
                                    className={
                                      order.status === "paid"
                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                        : order.status === "pending"
                                          ? "bg-amber-500 hover:bg-amber-600 text-white"
                                          : order.status === "abandoned"
                                            ? "bg-slate-400 hover:bg-slate-500 text-white"
                                            : "bg-red-500 hover:bg-red-600 text-white"
                                    }
                                  >
                                    {order.status === "paid"
                                      ? t.orders.paid
                                      : order.status === "pending"
                                        ? t.orders.pending
                                        : order.status === "abandoned"
                                          ? t.orders.abandoned
                                          : t.orders.cancelled}
                                  </Badge>
                                  <Badge variant="outline">POS</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {getTotalProducts(order)} {t.orders.products}
                                  </span>
                                  <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                                  {expandedOrders.includes(order.id) ? (
                                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-transparent"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openPosEdit(order)
                                    }}
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-transparent text-destructive hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleCancelPosOrder(order.id)
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <div className="border-t pt-4 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <h4 className="font-medium">{t.orders.orderDetail}</h4>
                                  <div className="flex items-center gap-2">
                                    {order.phoneNumber !== "0" && (
                                      <Button variant="outline" size="sm" className="bg-transparent" asChild>
                                        <Link
                                          href={`https://wa.me/${order.phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
                                            `Hola ${order.customerName}, seguimos tu pedido. Orden: ${order.orderNumber ?? order.id}`
                                          )}`}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          <MessageCircle className="h-4 w-4 mr-2" />
                                          WhatsApp
                                        </Link>
                                      </Button>
                                    )}
                                    <span className="text-sm text-muted-foreground">
                                      {t.orders.changeStatus}:
                                    </span>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="bg-transparent">
                                          {order.status === "paid"
                                            ? t.orders.paid
                                            : order.status === "pending"
                                              ? t.orders.pending
                                              : order.status === "abandoned"
                                                ? t.orders.abandoned
                                                : t.orders.cancelled}
                                          <ChevronDown className="h-4 w-4 ml-2" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleChangeOrderStatus(order.id, "paid")
                                          }}
                                        >
                                          {t.orders.markAsPaid}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleChangeOrderStatus(order.id, "pending")
                                          }}
                                        >
                                          {t.orders.markAsPending}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleChangeOrderStatus(order.id, "abandoned")
                                          }}
                                        >
                                          {t.orders.abandoned}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleChangeOrderStatus(order.id, "cancelled")
                                          }}
                                        >
                                          {t.orders.cancelled}
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>{t.orders.product}</TableHead>
                                        <TableHead className="text-center">{t.orders.quantity}</TableHead>
                                        <TableHead className="text-right">{t.orders.unitPrice}</TableHead>
                                        <TableHead className="text-right">{t.orders.subtotal}</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {order.items.map((item, index) => (
                                        <TableRow key={index}>
                                          <TableCell className="font-medium">{item.productName}</TableCell>
                                          <TableCell className="text-center">{item.quantity}</TableCell>
                                          <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                                          <TableCell className="text-right">
                                            {formatPrice(item.price * item.quantity)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                      <TableRow>
                                        <TableCell colSpan={3} className="text-right font-medium text-muted-foreground">
                                          Subtotal
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-muted-foreground">
                                          {formatPrice(
                                            order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
                                          )}
                                        </TableCell>
                                      </TableRow>

                                      <TableRow>
                                        <TableCell colSpan={3} className="text-right font-bold">
                                          {t.orders.total}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-primary">
                                          {formatPrice(order.total)}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isEditingPosOrder} onOpenChange={setIsEditingPosOrder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar venta POS</DialogTitle>
            <DialogDescription>Actualiza los datos y productos vendidos.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pos-edit-name">Cliente</Label>
              <Input
                id="pos-edit-name"
                value={posEditCustomerName}
                onChange={(e) => setPosEditCustomerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pos-edit-phone">Teléfono</Label>
              <Input
                id="pos-edit-phone"
                value={posEditPhoneNumber}
                onChange={(e) => setPosEditPhoneNumber(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Productos</p>
              {posEditItems.length === 0 && (
                <p className="text-sm text-muted-foreground">Agrega productos para esta venta.</p>
              )}
              {posEditItems.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updatePosEditQuantity(item.product.id, Number(e.target.value))
                      }
                      className="h-8 w-16"
                    />
                    <span className="text-sm font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => updatePosEditQuantity(item.product.id, 0)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-sm font-semibold">{formatPrice(posEditSubtotal)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="bg-transparent" onClick={() => setIsEditingPosOrder(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePosEdit} disabled={isSavingPosOrder}>
              {isSavingPosOrder ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}





