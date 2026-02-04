"use client"

import Link from "next/link"
import { Instagram, Facebook, Mail } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Lilu&apos;s Bakery
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.shop}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.nav.cookies}
                </Link>
              </li>
              <li>
                <Link href="/category/brownies" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.nav.brownies}
                </Link>
              </li>
              <li>
                <Link href="/galletondy" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.nav.laGalletondy}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.connect}</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Lilu&apos;s Bakery. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
