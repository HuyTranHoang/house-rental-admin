import ListDistrict from '@/features/district/ListDistrict.tsx'
import AddUpdateDistrict from '@/features/district/AddUpdateDistrict.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'
import ROUTER_NAMES from '@/constant/routerNames.ts'

const districtRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: ROUTER_NAMES.DISTRICT,
    element: <ListDistrict />,
    breadcrumb: 'district.list'
  },
  {
    path: ROUTER_NAMES.ADD_DISTRICT,
    element: <AddUpdateDistrict />,
    breadcrumb: 'district.add'
  },
  {
    path: ROUTER_NAMES.DETAIL_DISTRICT,
    breadcrumb: null
  },
  {
    path: ROUTER_NAMES.EDIT_DISTRICT,
    element: <AddUpdateDistrict />,
    breadcrumb: 'district.edit'
  }
]

export default districtRouter
