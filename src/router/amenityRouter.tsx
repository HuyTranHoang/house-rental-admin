import AddUpdateAmenity from '../features/amenity/AddUpdateAmenity.tsx'
import ListAmenity from '../features/amenity/ListAmenity.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'

const amenityRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: '/amenity',
    element: <ListAmenity />,
    breadcrumb: 'Danh sách tiện ích'
  },
  {
    path: '/amenity/add',
    element: <AddUpdateAmenity />,
    breadcrumb: 'Thêm mới tiện ích'
  },
  {
    path: '/amenity/:id/edit',
    element: <AddUpdateAmenity />,
    breadcrumb: 'Cập nhật tiện ích'
  }
]

export default amenityRouter