import AddUpdateAmenity from '@/features/amenity/AddUpdateAmenity.tsx'
import ListAmenity from '@/features/amenity/ListAmenity.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'
import ROUTER_NAMES from '@/constant/routerNames.ts'

const amenityRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: ROUTER_NAMES.AMENITY,
    element: <ListAmenity />,
    breadcrumb: 'amenity.list'
  },
  {
    path: ROUTER_NAMES.ADD_AMENITY,
    element: <AddUpdateAmenity />,
    breadcrumb: 'amenity.add'
  },
  {
    path: ROUTER_NAMES.DETAIL_AMENITY,
    breadcrumb: null
  },
  {
    path: ROUTER_NAMES.EDIT_AMENITY,
    element: <AddUpdateAmenity />,
    breadcrumb: 'amenity.edit'
  }
]

export default amenityRouter