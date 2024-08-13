

import PropertyList from '@/features/property/PropertyList'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'

const propertyRounter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: '/property/list',
    element: < PropertyList/>,
    breadcrumb: 'Danh Sách Bài Đăng'
  }
]

export default propertyRounter