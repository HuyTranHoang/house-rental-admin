import AddUpdateAmenity from '../features/amenity/AddUpdateAmenity.tsx'
import ListAmenity from '../features/amenity/ListAmenity.tsx'

const amenityRouter = [
  {
    path: '/amenity',
    element: <ListAmenity />
  },
  {
    path: '/amenity/add',
    element: <AddUpdateAmenity />
  },
  {
    path: '/amenity/:id/edit',
    element: <AddUpdateAmenity />
  }
]

export default amenityRouter