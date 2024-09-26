import { User } from '@/types/user.type.ts'
import { AuthSlice, UISlice } from '@/store.ts'

import { StateCreator } from 'zustand/index'

const initialState = {
  user: null,
  token: null,
  isAdmin: false
}

export const createAuthSlice: StateCreator<UISlice & AuthSlice, [], [], AuthSlice> = (set) => ({
  user: null,
  token: null,
  isAdmin: false,
  loginSuccess: (user: User, token: string) => {
    set({ user, token, isAdmin: user.roles.includes('ROLE_ADMIN') })
  },
  logout: () => set(initialState)
})
