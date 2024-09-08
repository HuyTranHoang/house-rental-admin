import { createSlice } from '@reduxjs/toolkit'
import { IRootState } from '@/store.ts'

interface IAppSlice {
  isDarkMode: boolean
}

const initialState: IAppSlice = {
  isDarkMode: false
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode
    }
  }
})

export const { toggleDarkMode } = appSlice.actions
export default appSlice.reducer
export const selectIsDarkMode = (state: IRootState) => state.app.isDarkMode