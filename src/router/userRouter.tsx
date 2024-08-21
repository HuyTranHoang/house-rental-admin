import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'
import ListUser from '@/features/user/ListUser.tsx'
import ROUTER_NAMES from '@/constant/routerNames.ts'

const userRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: ROUTER_NAMES.USER,
    element: <ListUser />,
    breadcrumb: 'Danh sách người dùng'
  }
]

export default userRouter