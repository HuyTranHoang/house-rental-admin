import { createSlice } from '@reduxjs/toolkit'
import { IRootState } from '../store.ts'
import { BreadcrumbItemType, BreadcrumbSeparatorType } from 'antd/es/breadcrumb/Breadcrumb'

interface UiSliceState {
  breadcrumb: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]
}

const initialState: UiSliceState = {
  breadcrumb: [
    {
      path: '/',
      title: 'Dashboard',
    }
  ]
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setBreadcrumb: (state, action) => {
      state.breadcrumb = action.payload
    }
  }
})

export const {
  setBreadcrumb
} = uiSlice.actions

export default uiSlice.reducer

export const selectUi = (state: IRootState) => state.ui