import ListCity from './ListCity.tsx'
import AddUpdateCity from './AddUpdateCity.tsx'

const cityRouter = [
  {
    path: '/city',
    element: <ListCity />
  },
  {
    path: '/city/add',
    element: <AddUpdateCity />
  },
  {
    path: '/city/:id/edit',
    element: <AddUpdateCity />
  }
]

export default cityRouter