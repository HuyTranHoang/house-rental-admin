import { AuthSlice, UISlice } from '@/store.ts'
import { User } from '@/types/user.type.ts'

import { StateCreator } from 'zustand/index'

const initialState = {
  user: null,
  token: null,
  isAdmin: false,
  haveDashboardAccess: false
}

export const createAuthSlice: StateCreator<UISlice & AuthSlice, [], [], AuthSlice> = (set) => ({
  user: null,
  token: null,
  isAdmin: false,
  haveDashboardAccess: false,
  loginSuccess: (user: User, token: string) => {
    set({
      user,
      token,
      isAdmin: user.roles.includes('ROLE_ADMIN'),
      haveDashboardAccess: user.authorities.includes('dashboard:read')
    })
  },
  logout: () => set(initialState)
})
