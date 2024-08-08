import AddUpdateAmenity from "./AddUpdateAmenity";
import ListAmenity from "./ListAmenity";


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
    },
]

export default amenityRouter