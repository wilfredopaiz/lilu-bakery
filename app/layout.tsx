import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { CartProvider } from "@/components/cart-provider"
import { LanguageProvider } from "@/components/language-provider"
import { Toaster } from "@/components/ui/toaster"
import { GlobalNotices } from "@/components/global-notices"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Lilu's Bakery - Artisan Cookies & Brownies",
  description: "Handcrafted cookies and brownies made with love",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/apple-icon.jpg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/apple-icon.jpg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/apple-icon.jpg",
        type: "image/jpeg",
      },
    ],
    apple: "/apple-icon.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${playfair.variable}`}>
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          <CartProvider>
            {children}
            <GlobalNotices />
          </CartProvider>
        </LanguageProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
