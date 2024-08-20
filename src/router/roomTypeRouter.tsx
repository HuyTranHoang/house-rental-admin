import ListRoomType from '@/features/roomType/ListRoomType.tsx'
import AddUpdateRoomType from '@/features/roomType/AddUpdateRoomType.tsx'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'
import ROUTER_NAMES from '@/constant/routerNames.ts'

const roomTypeRouter: RouteObject[] & BreadcrumbsRoute[]  = [
  {
    path: ROUTER_NAMES.ROOM_TYPE,
    element: <ListRoomType />,
    breadcrumb: 'Danh sách loại phòng'
  },
  {
    path: ROUTER_NAMES.ADD_ROOM_TYPE,
    element: <AddUpdateRoomType />,
    breadcrumb: 'Thêm mới loại phòng'
  },
  {
    path: ROUTER_NAMES.DETAIL_ROOM_TYPE,
    breadcrumb: null,
  },
  {
    path: ROUTER_NAMES.EDIT_ROOM_TYPE,
    element: <AddUpdateRoomType />,
    breadcrumb: ({match}) => `Cập nhật loại phòng / ${match.params.id}`
  }
]

export default roomTypeRouter