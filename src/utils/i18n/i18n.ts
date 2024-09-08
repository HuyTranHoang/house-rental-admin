import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enLang from '@/utils/i18n/locales/en/en.json'
import viLang from '@/utils/i18n/locales/vi/vi.json'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
export const resources = {
  en: {
    translation: enLang
  },
  vi: {
    translation: viLang
  }
}

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: ['en', 'vi'],
  lng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
