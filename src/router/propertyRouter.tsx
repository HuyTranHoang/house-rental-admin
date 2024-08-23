import ROUTER_NAMES from '@/constant/routerNames'
import PropertyList from '@/features/property/PropertyList'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'

const propertyRounter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: ROUTER_NAMES.PROPERTY,
    element: <PropertyList />,
    breadcrumb: 'Danh Sách bất động sản'
  }
]

export default propertyRounter
