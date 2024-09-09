import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { i18nextPlugin } from 'translation-check'

import enLangBreadcrumbs from '@/utils/i18n/locales/en/en-breadcrumbs.json'
import enLangCity from '@/utils/i18n/locales/en/en-city.json'
import enLang from '@/utils/i18n/locales/en/en.json'
import viLangBreadcrumbs from '@/utils/i18n/locales/vi/vi-breadcrumbs.json'
import viLangCity from '@/utils/i18n/locales/vi/vi-city.json'
import viLang from '@/utils/i18n/locales/vi/vi.json'

export const defaultNS = 'lang'
export const resources = {
  en: {
    lang: enLang,
    langCity: enLangCity,
    langBreadcrumbs: enLangBreadcrumbs
  },
  vi: {
    lang: viLang,
    langCity: viLangCity,
    langBreadcrumbs: viLangBreadcrumbs
  }
} as const

i18n
  .use(i18nextPlugin)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    lng: 'en',
    fallbackLng: 'en',
    ns: ['lang', 'langCity', 'langBreadcrumbs'],
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
