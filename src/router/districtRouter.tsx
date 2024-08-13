import ListDistrict from '@/features/district/ListDistrict.tsx'
import AddUpdateDistrict from '@/features/district/AddUpdateDistrict.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'

const districtRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: '/district',
    element: <ListDistrict />,
    breadcrumb: 'Danh sách quận huyện'
  },
  {
    path: '/district/add',
    element: <AddUpdateDistrict />,
    breadcrumb: 'Thêm mới quận huyện'
  },
  {
    path: '/district/:id',
    breadcrumb: null
  },
  {
    path: '/district/:id/edit',
    element: <AddUpdateDistrict />,
    breadcrumb: ({ match }) => `Cập nhật quận huyện / ${match.params.id}`
  }
]

export default districtRouter
