import ListRoomType from '../features/roomType/ListRoomType.tsx'
import AddUpdateRoomType from '../features/roomType/AddUpdateRoomType.tsx'

const roomTypeRouter = [
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