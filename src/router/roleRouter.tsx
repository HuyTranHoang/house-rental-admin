import ListRole from '../features/role/ListRole.tsx'
import { RouteObject } from 'react-router-dom'

const roleRouter: RouteObject[] = [
  {
    path: '/role',
    element: <ListRole />
  }
]

export default roleRouter