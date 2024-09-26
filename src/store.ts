import { createAuthSlice } from '@/features/auth/authSlice.ts'
import { User } from '@/types/user.type.ts'
import { createUISlice } from '@/ui/uiSlice.ts'
import { create } from 'zustand'

export type UISlice = {
  isDarkMode: boolean
  i18n: string
  toggleDarkMode: () => void
  setI18n: (lang: string) => void
}

export type AuthSlice = {
  user: User | null
  token: string | null
  isAdmin: boolean
  loginSuccess: (user: User, token: string) => void
  logout: () => void
}

const useBoundStore = create<UISlice & AuthSlice>()((...a) => ({
  ...createUISlice(...a),
  ...createAuthSlice(...a)
}))

export default useBoundStore
