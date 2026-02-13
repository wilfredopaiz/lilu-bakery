"use client"

import { useEffect, useState } from "react"
import { getTranslations, type Language } from "@/lib/i18n"

const STORAGE_KEY = "dashboard-language"

export function useDashboardLanguage() {
  const [language, setLanguage] = useState<Language>("es")

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "es" || stored === "en") {
      setLanguage(stored)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  return {
    language,
    setLanguage,
    t: getTranslations(language),
  }
}
