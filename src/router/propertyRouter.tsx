
import PropertyList from '@/features/property/propertyList'
import PropertyPending from '@/features/property/propertyPending'
import PropertyRejected from '@/features/property/PropertyRejected'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'

const propertyRounter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: '/property/list',
    element: < PropertyList/>,
    breadcrumb: 'Danh Sách Bài Đăng'
  },
  {
    path: '/property/pending',
    element: <PropertyPending />,
    breadcrumb: 'Danh Sách Chờ Duyệt'
  },
  {
    path: '/property/rejected',
    element: <PropertyRejected />,
    breadcrumb: 'Danh Sách Từ Chối'
  }
]

export default propertyRounter