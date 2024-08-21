import ListCity from '@/features/city/ListCity.tsx'
import AddUpdateCity from '@/features/city/AddUpdateCity.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'
import ROUTER_NAMES from '@/constant/routerNames.ts'

const cityRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: ROUTER_NAMES.CITY,
    element: <ListCity />,
    breadcrumb: 'Danh sách thành phố'
  },
  {
    path: ROUTER_NAMES.ADD_CITY,
    element: <AddUpdateCity />,
    breadcrumb: 'Thêm mới thành phố'
  },
  {
    path: ROUTER_NAMES.DETAIL_CITY,
    breadcrumb: null
  },
  {
    path: ROUTER_NAMES.EDIT_CITY,
    element: <AddUpdateCity />,
    breadcrumb: ({ match }) => `Cập nhật thành phố / ${match.params.id}`
  }
]

export default cityRouter
