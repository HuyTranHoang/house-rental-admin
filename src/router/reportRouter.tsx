import ListReport from '@/features/report/ListReport.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'

const reportRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: '/report',
    element: <ListReport />,
    breadcrumb: 'Danh sách báo cáo'
  }
]

export default reportRouter