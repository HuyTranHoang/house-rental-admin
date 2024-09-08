import Login from '@/features/auth/Login.tsx'
import Dashboard from '@/features/dashboard/Dashboard.tsx'
import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute.tsx'
import AppLayout from '../ui/AppLayout.tsx'

import amenityRouter from './amenityRouter.tsx'
import cityRouter from './cityRouter.tsx'
import propertyRouter from './propertyRouter.tsx'
import reportRouter from './reportRouter.tsx'
import reviewRouter from './reviewRouter.tsx'
import roleRouter from './roleRouter.tsx'
import roomTypeRouter from './roomTypeRouter.tsx'

import ROUTER_NAMES from '@/constant/routerNames.ts'
import districtRouter from '@/router/districtRouter.tsx'
import userRouter from '@/router/userRouter.tsx'

export const routerList = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout haveBgColor={false} />,
        children: [
          {
            path: ROUTER_NAMES.DASHBOARD,
            element: <Dashboard />,
            breadcrumb: () => 'sidebar.dashboard'
          }
        ]
      }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          ...cityRouter, // /city, /city/add, /city/:id/edit
          ...districtRouter, // /district, /district/add, /district/:id/edit
          ...roomTypeRouter, // /roomType, /roomType/add, /roomType/:id/edit
          ...amenityRouter, // /amenity, /amenity/add, /amenity/:id:edit
          ...reportRouter, // /report
          ...roleRouter, // /role
          ...reviewRouter, //review
          ...userRouter, // /user
          ...propertyRouter // properties
        ] // End of ProtectedRoute children
      }
    ] // End of AppLayout children
  },
  {
    path: ROUTER_NAMES.LOGIN,
    element: <Login />
  },
  {
    path: '*',
    element: <div>Page Not Found</div>
  }
]

const router = createBrowserRouter(routerList)

export default router
