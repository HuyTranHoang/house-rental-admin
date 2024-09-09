import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enLangCity from '@/utils/i18n/locales/en/en-city.json'
import enLang from '@/utils/i18n/locales/en/en.json'
import viLangCity from '@/utils/i18n/locales/vi/vi-city.json'
import viLang from '@/utils/i18n/locales/vi/vi.json'

export const defaultNS = 'lang'
export const resources = {
  en: {
    lang: enLang,
    langCity: enLangCity
  },
  vi: {
    lang: viLang,
    langCity: viLangCity
  }
} as const

i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  lng: 'en',
  fallbackLng: 'en',
  ns: ['lang', 'langCity'],
  interpolation: {
    escapeValue: false
  }
})

export default i18n