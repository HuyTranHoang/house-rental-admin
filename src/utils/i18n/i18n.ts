import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { i18nextPlugin } from 'translation-check'

import en_amanity from '@/utils/i18n/locales/en/amenity.json'
import en_breadcrumbs from '@/utils/i18n/locales/en/breadcrumbs.json'
import en_city from '@/utils/i18n/locales/en/city.json'
import en_common from '@/utils/i18n/locales/en/common.json'
import en_review from '@/utils/i18n/locales/en/review.json'

import vi_amanity from '@/utils/i18n/locales/vi/amenity.json'
import vi_breadcrumbs from '@/utils/i18n/locales/vi/breadcrumbs.json'
import vi_city from '@/utils/i18n/locales/vi/city.json'
import vi_common from '@/utils/i18n/locales/vi/common.json'
import vi_review from '@/utils/i18n/locales/vi/review.json'

export const defaultNS = 'common'
export const resources = {
  en: {
    common: en_common,
    city: en_city,
    review: en_review,
    breadcrumbs: en_breadcrumbs,
    amenity: en_amanity
  },
  vi: {
    common: vi_common,
    city: vi_city,
    review: vi_review,
    breadcrumbs: vi_breadcrumbs,
    amenity: vi_amanity
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
    ns: ['common', 'breadcrumbs', 'city', 'review', 'amenity'],
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
