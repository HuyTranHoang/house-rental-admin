import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../ui/AppLayout.tsx'
import ProtectedRoute from '../components/ProtectedRoute.tsx'
import Dashboard from '@/features/dashboard/Dashboard.tsx'
import Login from '@/features/auth/Login.tsx'

import amenityRouter from './amenityRouter.tsx'
import cityRouter from './cityRouter.tsx'
import roomTypeRouter from './roomTypeRouter.tsx'
import reportRouter from './reportRouter.tsx'
import roleRouter from './roleRouter.tsx'
import reviewRouter from './reviewRouter.tsx'
import { HomeOutlined } from '@ant-design/icons'

import userRouter from '@/router/userRouter.tsx'


export const routerList = [
  {
    element: <AppLayout haveBgColor={false} />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <Dashboard />,
            breadcrumb: () => <span><HomeOutlined /> Tổng quan</span>
          }
        ]
      }
    ]
  },
  {
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          ...cityRouter // /city, /city/add, /city/:id/edit
          ,
          ...roomTypeRouter // /roomType, /roomType/add, /roomType/:id/edit
          ,
          ...amenityRouter // /amenity, /amenity/add, /amenity/:id:edit
          ,
          ...reportRouter // /report
          ,
          ...roleRouter // /role
          ,
          ...reviewRouter //review
          ,
          ...userRouter // /user
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
]

const router = createBrowserRouter(routerList)

export default router
