import RoleManager from '@/features/role/RoleManager.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'
import ROUTER_NAMES from '@/constant/routerNames.ts'

const roleRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: ROUTER_NAMES.ROLE,
    element: <RoleManager />,
    breadcrumb: 'role.list'
  }
]

export default roleRouter