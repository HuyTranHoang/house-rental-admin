import { SetURLSearchParams } from 'react-router-dom'
import { SorterResult } from 'antd/lib/table/interface'
import React from 'react'

export const updateSortParams = <T>(
  sorter: SorterResult<T> | SorterResult<T>[],
  setSearchParams: SetURLSearchParams,
  setSortedInfo: React.Dispatch<React.SetStateAction<SorterResult<T>>>
) => {
  if (!Array.isArray(sorter)) {
    if (sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setSearchParams(prev => {
        prev.set('sortBy', `${sorter.field}${order}`)
        return prev
      }, { replace: true })
    } else {
      setSearchParams(prev => {
        prev.set('sortBy', '')
        return prev
      }, { replace: true })
      setSortedInfo({})
    }
  }
}