
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { enUS, vi } from 'date-fns/locale'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const locales = {
  en: enUS,
  vi: vi
}

export function useCustomDateFormatter() {
  const { i18n } = useTranslation()

  return useMemo(() => {
    return (createdAt: string | undefined): string => {
      if (!createdAt) {
        return 'Invalid date'
      }

      try {
        const date = parseISO(createdAt)
        const now = new Date()
        const oneDayInMs = 24 * 60 * 60 * 1000
        const locale = locales[i18n.language as keyof typeof locales] || enUS

        if (now.getTime() - date.getTime() < oneDayInMs) {
          return formatDistanceToNow(date, { addSuffix: true, locale })
        } else {
          return format(date, 'dd MMMM, yyyy', { locale })
        }
      } catch (error) {
        return 'Invalid date'
      }
    }
  }, [i18n.language])
}