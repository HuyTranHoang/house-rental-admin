import 'i18next'
import { defaultNS, resources } from '@/utils/i18n/i18n.ts'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources["en"];
  }
}
