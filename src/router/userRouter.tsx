import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'
import ListUser from '@/features/user/ListUser.tsx'

const userRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: '/user',
    element: <ListUser />,
    breadcrumb: 'Danh sách người dùng'
  }
]

export default userRouter