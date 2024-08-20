import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import authReducer from './features/auth/authSlice.ts'

const store = configureStore({
  reducer: {
    auth: authReducer
  }
})

export default store
export type IRootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()