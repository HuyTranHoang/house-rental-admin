import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en_amanity from '@/utils/i18n/locales/en/amenity.json'
import en_breadcrumbs from '@/utils/i18n/locales/en/breadcrumbs.json'
import en_city from '@/utils/i18n/locales/en/city.json'
import en_common from '@/utils/i18n/locales/en/common.json'
import en_district from '@/utils/i18n/locales/en/district.json'
import en_report from '@/utils/i18n/locales/en/report.json'
import en_review from '@/utils/i18n/locales/en/review.json'
import en_role from '@/utils/i18n/locales/en/role.json'
import en_roomType from '@/utils/i18n/locales/en/roomType.json'
import en_transaction from '@/utils/i18n/locales/en/transaction.json'
import en_user from '@/utils/i18n/locales/en/user.json'

import vi_amanity from '@/utils/i18n/locales/vi/amenity.json'
import vi_breadcrumbs from '@/utils/i18n/locales/vi/breadcrumbs.json'
import vi_city from '@/utils/i18n/locales/vi/city.json'
import vi_common from '@/utils/i18n/locales/vi/common.json'
import vi_district from '@/utils/i18n/locales/vi/district.json'
import vi_report from '@/utils/i18n/locales/vi/report.json'
import vi_review from '@/utils/i18n/locales/vi/review.json'
import vi_role from '@/utils/i18n/locales/vi/role.json'
import vi_roomType from '@/utils/i18n/locales/vi/roomType.json'
import vi_transaction from '@/utils/i18n/locales/vi/transaction.json'
import vi_user from '@/utils/i18n/locales/vi/user.json'

export const defaultNS = 'common'
export const resources = {
  en: {
    common: en_common,
    city: en_city,
    review: en_review,
    breadcrumbs: en_breadcrumbs,
    amenity: en_amanity,
    roomType: en_roomType,
    report: en_report,
    user: en_user,
    transaction: en_transaction,
    district: en_district,
    role: en_role
  },
  vi: {
    common: vi_common,
    city: vi_city,
    review: vi_review,
    breadcrumbs: vi_breadcrumbs,
    amenity: vi_amanity,
    roomType: vi_roomType,
    report: vi_report,
    user: vi_user,
    transaction: vi_transaction,
    district: vi_district,
    role: vi_role
  }
} as const

i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  lng: localStorage.getItem('i18n') || 'en',
  fallbackLng: ['en', 'vi'],
  ns: [
    'common',
    'breadcrumbs',
    'city',
    'review',
    'amenity',
    'roomType',
    'report',
    'user',
    'district',
    'role',
    'transaction'
  ],
  interpolation: {
    escapeValue: false
  }
})

export default i18n
