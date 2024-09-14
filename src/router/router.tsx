import ProtectedRoute from '@/components/ProtectedRoute.tsx'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import ListAmenity from '@/features/amenity/ListAmenity.tsx'
import Login from '@/features/auth/Login.tsx'
import ListCity from '@/features/city/ListCity.tsx'
import Dashboard from '@/features/dashboard/Dashboard.tsx'
import ListProperty from '@/features/property/ListProperty.tsx'
import ListReport from '@/features/report/ListReport.tsx'
import ListReview from '@/features/review/ListReview.tsx'
import RoleManager from '@/features/role/RoleManager.tsx'
import ListUser from '@/features/user/ListUser.tsx'
import districtRouter from '@/router/districtRouter.tsx'
import AppLayout from '@/ui/AppLayout.tsx'
import { createBrowserRouter } from 'react-router-dom'
import ListRoomType from '@/features/roomType/ListRoomType.tsx'

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
            breadcrumb: () => 'dashboard'
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
          {
            path: ROUTER_NAMES.CITY,
            element: <ListCity />,
            breadcrumb: 'city.list'
          },
          ...districtRouter, // /district, /district/add, /district/:id/edit
          {
            path: ROUTER_NAMES.ROOM_TYPE,
            element: <ListRoomType />,
            breadcrumb: 'roomType.list'
          },
          {
            path: ROUTER_NAMES.AMENITY,
            element: <ListAmenity />,
            breadcrumb: 'amenity.list'
          },
          {
            path: ROUTER_NAMES.REPORT,
            element: <ListReport />,
            breadcrumb: 'report.list'
          },
          {
            path: ROUTER_NAMES.ROLE,
            element: <RoleManager />,
            breadcrumb: 'role.list'
          },
          {
            path: ROUTER_NAMES.REVIEW,
            element: <ListReview />,
            breadcrumb: 'review.list'
          },
          {
            path: ROUTER_NAMES.USER,
            element: <ListUser />,
            breadcrumb: 'user.list'
          },
          {
            path: ROUTER_NAMES.PROPERTY,
            element: <ListProperty />,
            breadcrumb: 'property'
          }
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
