import ListRoomType from '../features/roomType/ListRoomType.tsx'
import AddUpdateRoomType from '../features/roomType/AddUpdateRoomType.tsx'
import { RouteObject } from 'react-router-dom'

const roomTypeRouter: RouteObject[] = [
  {
    path: '/roomType',
    element: <ListRoomType />
  },
  {
    path: '/roomType/add',
    element: <AddUpdateRoomType />
  },
  {
    path: '/roomType/:id/edit',
    element: <AddUpdateRoomType />
  }
]

export default roomTypeRouter