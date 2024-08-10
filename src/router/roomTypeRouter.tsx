import ListRoomType from '../features/roomType/ListRoomType.tsx'
import AddUpdateRoomType from '../features/roomType/AddUpdateRoomType.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'

const roomTypeRouter: RouteObject[] & BreadcrumbsRoute[]  = [
  {
    path: '/roomType',
    element: <ListRoomType />,
    breadcrumb: 'Danh sách loại phòng'
  },
  {
    path: '/roomType/add',
    element: <AddUpdateRoomType />,
    breadcrumb: 'Thêm mới loại phòng'
  },
  {
    path: '/roomType/:id/edit',
    element: <AddUpdateRoomType />,
    breadcrumb: 'Cập nhật loại phòng'
  }
]

export default roomTypeRouter