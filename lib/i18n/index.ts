import en from "./en.json"
import es from "./es.json"

export type Language = "en" | "es"

const translations = { en, es }

export function getTranslations(lang: Language) {
  return translations[lang]
}

export type Translations = typeof en
