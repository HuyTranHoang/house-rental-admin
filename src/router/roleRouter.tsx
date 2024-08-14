import RoleManager from '@/features/role/RoleManager.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'

const roleRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: '/role',
    element: <RoleManager />,
    breadcrumb: 'Danh sách vai trò'
  }
]

export default roleRouter