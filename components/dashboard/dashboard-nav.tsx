"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Package, Settings, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

const ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Package },
  { href: "/dashboard/productos", label: "Productos", icon: Package },
  { href: "/dashboard/pos", label: "POS", icon: ShoppingCart },
  { href: "/dashboard/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/dashboard/configuracion", label: "Configuración", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="w-full max-w-full overflow-x-auto">
      <div className="flex flex-nowrap gap-2">
        {ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={cn("gap-2 whitespace-nowrap", !isActive && "bg-transparent")}
            >
              <Link href={item.href}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

