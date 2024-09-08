// import the original type declarations
import 'i18next'
// import all namespaces (for the default language, only)
import engLang from '@/utils/i18n/locales/en/en.json'

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: 'engLang'
    // custom resources type
    resources: {
      engLang: typeof engLang
    }
    // other
  }
}
