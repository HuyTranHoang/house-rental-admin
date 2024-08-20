import ListReport from '@/features/report/ListReport.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'
import ROUTER_NAMES from '@/constant/routerNames.ts'

const reportRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: ROUTER_NAMES.REPORT,
    element: <ListReport />,
    breadcrumb: 'Danh sách báo cáo'
  }
]

export default reportRouter