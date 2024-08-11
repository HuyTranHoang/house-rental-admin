import AddUpdateAmenity from '@/features/amenity/AddUpdateAmenity.tsx'
import ListAmenity from '@/features/amenity/ListAmenity.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'

const amenityRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: '/amenity',
    element: <ListAmenity />,
    breadcrumb: 'Danh sách tiện nghi'
  },
  {
    path: '/amenity/add',
    element: <AddUpdateAmenity />,
    breadcrumb: 'Thêm mới tiện nghi'
  },
  {
    path: '/amenity/:id',
    breadcrumb: null,
  },
  {
    path: '/amenity/:id/edit',
    element: <AddUpdateAmenity />,
    breadcrumb: ({match}) => `Cập nhật tiện nghi / ${match.params.id}`
  }
]

export default amenityRouter