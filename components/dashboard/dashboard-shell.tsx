"use client"

import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase/client"
import { useDashboardLanguage } from "@/hooks/dashboard/use-dashboard-language"
import { DashboardUiProvider } from "@/components/dashboard/dashboard-ui-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const { language, setLanguage, t } = useDashboardLanguage()

  useEffect(() => {
    let mounted = true

    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setAuthChecked(true)
    })

    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setAuthChecked(true)
    })

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (authChecked && !session) {
      router.push("/login")
    }
  }, [authChecked, session, router])

  if (!authChecked || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Cargando dashboard...
      </div>
    )
  }

  return (
    <DashboardUiProvider value={{ language, setLanguage, t }}>
      <div className="min-h-screen bg-muted/30">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8 space-y-6">
          <DashboardNav />
          {children}
        </main>
      </div>
    </DashboardUiProvider>
  )
}
