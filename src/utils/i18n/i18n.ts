import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { i18nextPlugin } from 'translation-check'

import enLangBreadcrumbs from '@/utils/i18n/locales/en/breadcrumbs.json'
import enLangCity from '@/utils/i18n/locales/en/city.json'
import enLang from '@/utils/i18n/locales/en/common.json'
import enLangReview from '@/utils/i18n/locales/en/review.json'

import viLangBreadcrumbs from '@/utils/i18n/locales/vi/breadcrumbs.json'
import viLangCity from '@/utils/i18n/locales/vi/city.json'
import viLang from '@/utils/i18n/locales/vi/common.json'
import viLangReview from '@/utils/i18n/locales/vi/review.json'

export const defaultNS = 'common'
export const resources = {
  en: {
    common: enLang,
    city: enLangCity,
    review: enLangReview,
    breadcrumbs: enLangBreadcrumbs
  },
  vi: {
    common: viLang,
    city: viLangCity,
    review: viLangReview,
    breadcrumbs: viLangBreadcrumbs
  }
} as const

i18n
  .use(i18nextPlugin)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    lng: 'en',
    fallbackLng: ['en', 'vi'],
    ns: ['common', 'city', 'review', 'breadcrumbs'],
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
