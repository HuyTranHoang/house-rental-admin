import ROUTER_NAMES from '@/constant/routerNames'
import ListProperty from '@/features/property/ListProperty.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'

const propertyRounter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: ROUTER_NAMES.PROPERTY,
    element: <ListProperty />,
    breadcrumb: 'Danh Sách Bài Đăng'
  }
]

export default propertyRounter
