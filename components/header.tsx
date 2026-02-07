"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Menu, User, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { itemCount } = useCart()
  const { language, setLanguage, t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigation = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.sanValentin, href: "/seasonal/valentin" },
    { name: t.nav.cookies, href: "/category/cookies" },
    { name: t.nav.brownies, href: "/category/brownies" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Lilu's Bakery"
              width={313}
              height={135}
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setLanguage("es")}
                  className={language === "es" ? "bg-primary/10" : ""}
                >
                  {t.language.spanish}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={language === "en" ? "bg-primary/10" : ""}
                >
                  {t.language.english}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/login" className="hidden md:block">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col space-y-2 mt-8">
                  {navigation.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-base font-medium hover:bg-primary/10 hover:text-primary px-4 py-6"
                      >
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-base font-medium hover:bg-primary/10 hover:text-primary px-4 py-6"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {t.nav.login}
                    </Button>
                  </Link>
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex gap-2 px-4">
                      <Button
                        variant={language === "es" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLanguage("es")}
                        className={language === "es" ? "" : "bg-transparent"}
                      >
                        ES
                      </Button>
                      <Button
                        variant={language === "en" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLanguage("en")}
                        className={language === "en" ? "" : "bg-transparent"}
                      >
                        EN
                      </Button>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
