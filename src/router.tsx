import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './ui/AppLayout.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import Dashboard from './features/dashboard/Dashboard.tsx'
import Login from './features/auth/Login.tsx'

import amenityRouter from './router/amenityRouter.tsx'
import cityRouter from './router/cityRouter.tsx'
import roomTypeRouter from './router/roomTypeRouter.tsx'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <Dashboard />
          },
          ...cityRouter // /city, /city/add, /city/:id/edit
          ,
          ...roomTypeRouter // /roomType, /roomType/add, /roomType/:id/edit
          ,
          ...amenityRouter // /amenity, /amenity/add, /amenity/:id:edit
        ] // End of ProtectedRoute children
      }
    ] // End of AppLayout children
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '*',
    element: <div>Page Not Found</div>
  }
])

export default router