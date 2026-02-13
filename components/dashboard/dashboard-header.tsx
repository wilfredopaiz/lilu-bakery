"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, Home, LogOut } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useDashboardUi } from "@/components/dashboard/dashboard-ui-context"

export function DashboardHeader() {
  const router = useRouter()
  const { language, setLanguage, t } = useDashboardUi()

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-serif text-2xl font-bold text-primary">
            Lilu's Bakery
          </Link>
          <Badge variant="secondary">{t.dashboard.badge}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{language === "es" ? t.language.spanish : t.language.english}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("es")}>{t.language.spanish}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>{t.language.english}</DropdownMenuItem>
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
  )
}
