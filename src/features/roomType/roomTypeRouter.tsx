import ListRoomType from './ListRoomType.tsx'
import AddUpdateCity from '../city/AddUpdateCity.tsx'

const roomTypeRouter = [
  {
    path: '/roomType',
    element: <ListRoomType />
  },
  {
    path: '/roomType/add',
    element: <AddUpdateCity />
  },
  {
    path: '/roomType/:id/edit',
    element: <AddUpdateCity />
  }
]

export default roomTypeRouter