import { IRootState } from '@/store.ts'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import i18next from 'i18next'

interface IAppSlice {
  isDarkMode: boolean
  i18n: string
}

const initialState: IAppSlice = {
  isDarkMode: false,
  i18n: 'vi'
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode
    },
    setI18n: (state, action: PayloadAction<string>) => {
      state.i18n = action.payload
      i18next.changeLanguage(action.payload)
    }
  }
})

export const { toggleDarkMode, setI18n } = appSlice.actions
export default appSlice.reducer
export const selectIsDarkMode = (state: IRootState) => state.app.isDarkMode
export const selectI18n = (state: IRootState) => state.app.i18n
