import RoleManager from '@/features/role/RoleManager.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'
import AddUpdateRole from '@/features/role/AddUpdateRole.tsx'

const roleRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: '/role',
    element: <RoleManager />,
    breadcrumb: 'Danh sách vai trò'
  },
  {
    path: '/role/add',
    element: <AddUpdateRole />,
    breadcrumb: 'Thêm vai trò'
  },
  {
    path: '/role/:id',
    breadcrumb: null,
  },
  {
    path: '/role/:id/edit',
    element: <AddUpdateRole />,
    breadcrumb: ({match}) => `Cập nhật vai trò / ${match.params.id}`
  }
]

export default roleRouter