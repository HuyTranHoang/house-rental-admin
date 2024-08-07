import ListRoomType from './ListRoomType.tsx'
import AddUpdateRoomType from './AddUpdateRoomType.tsx'

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