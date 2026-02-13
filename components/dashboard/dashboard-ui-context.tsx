"use client"

import { createContext, useContext } from "react"
import type { Language, Translations } from "@/lib/i18n"

interface DashboardUiContextValue {
  language: Language
  setLanguage: (next: Language) => void
  t: Translations
}

const DashboardUiContext = createContext<DashboardUiContextValue | null>(null)

export function DashboardUiProvider({
  value,
  children,
}: {
  value: DashboardUiContextValue
  children: React.ReactNode
}) {
  return <DashboardUiContext.Provider value={value}>{children}</DashboardUiContext.Provider>
}

export function useDashboardUi() {
  const ctx = useContext(DashboardUiContext)
  if (!ctx) {
    throw new Error("useDashboardUi must be used inside DashboardUiProvider")
  }
  return ctx
}
