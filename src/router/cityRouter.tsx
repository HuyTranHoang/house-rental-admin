import ListCity from '../features/city/ListCity.tsx'
import AddUpdateCity from '../features/city/AddUpdateCity.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'

const cityRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: '/city',
    element: <ListCity />,
    breadcrumb: 'Danh sách thành phố'
  },
  {
    path: '/city/add',
    element: <AddUpdateCity />,
    breadcrumb: 'Thêm mới thành phố'
  },
  {
    path: '/city/:id/edit',
    element: <AddUpdateCity />,
    breadcrumb: 'Cập nhật thành phố'
  }
]

export default cityRouter