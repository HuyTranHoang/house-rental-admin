import ListRole from '../features/role/ListRole.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'

const roleRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: '/role',
    element: <ListRole />,
    breadcrumb: 'Danh sách vai trò'
  }
]

export default roleRouter