import ListRole from '../features/role/ListRole.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'
import AddUpdateRole from '../features/role/AddUpdateRole.tsx'

const roleRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: '/role',
    element: <ListRole />,
    breadcrumb: 'Danh sách vai trò'
  },
  {
    path: '/role/add',
    element: <AddUpdateRole />,
    breadcrumb: 'Thêm vai trò'
  }
]

export default roleRouter