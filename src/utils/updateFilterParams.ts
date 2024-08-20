import { FilterValue } from 'antd/es/table/interface'
import { SetURLSearchParams } from 'react-router-dom'

export const updateFilterParams = (
  filterValue: FilterValue | null,
  paramName: string,
  setSearchParams: SetURLSearchParams
) => {

  console.log(filterValue)
  if (filterValue) {
    const value = filterValue[0]
    setSearchParams(prev => {
      prev.set(paramName, value as string)
      return prev
    }, { replace: true })
  } else {
    setSearchParams(prev => {
      prev.set(paramName, '0')
      return prev
    }, { replace: true })
  }
}