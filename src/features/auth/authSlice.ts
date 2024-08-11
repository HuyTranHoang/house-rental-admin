import { createSlice } from '@reduxjs/toolkit'
import { IRootState } from '@/store.ts'
import { User } from '@/models/user.type.ts'


interface IAuthState {
  user: User | null
  token: string | null
  isAdmin: boolean
  isLoading: boolean
}

const initialState: IAuthState = {
  user: null,
  token: null,
  isAdmin: false,
  isLoading: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.isLoading = true
    },
    loginSuccess: (state, action) => {
      state.isLoading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAdmin = action.payload.user.roles.includes('ROLE_ADMIN')
    },
    loginFailure: (state) => {
      state.isLoading = false
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAdmin = false
    }
  }
})

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout
} = authSlice.actions

export default authSlice.reducer

export const selectAuth = (state: IRootState) => state.auth