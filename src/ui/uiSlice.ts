import { AuthSlice, UISlice } from '@/store.ts'
import i18next from 'i18next'
import { StateCreator } from 'zustand'

export const createUISlice: StateCreator<UISlice & AuthSlice, [], [], UISlice> = (set) => ({
  isDarkMode: false,
  i18n: 'en',
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setI18n: (lang) => {
    set({ i18n: lang })
    i18next.changeLanguage(lang)
  }
})
