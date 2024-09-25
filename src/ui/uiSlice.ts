import { AuthSlice, UISlice } from '@/store.ts'
import i18next from 'i18next'
import { StateCreator } from 'zustand'

export const createUISlice: StateCreator<UISlice & AuthSlice, [], [], UISlice> = (set) => ({
  isDarkMode: localStorage.getItem('darkMode') === 'true' || false,
  i18n: localStorage.getItem('i18n') || 'en',
  toggleDarkMode: () =>
    set((state) => {
      localStorage.setItem('darkMode', state.isDarkMode ? 'false' : 'true')
      return { isDarkMode: !state.isDarkMode }
    }),
  setI18n: (lang) => {
    set({ i18n: lang })
    localStorage.setItem('i18n', lang)
    i18next.changeLanguage(lang)
  }
})
