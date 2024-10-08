import ProtectedRoute from '@/components/ProtectedRoute.tsx'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import AdvertisementManager from '@/features/advertisement/AdvertisementManager.tsx'
import AmenityManager from '@/features/amenity/AmenityManager.tsx'
import Login from '@/features/auth/Login.tsx'
import CityManager from '@/features/city/CityManager.tsx'
import CommentManager from '@/features/comment/CommentManager.tsx'
import Dashboard from '@/features/dashboard/Dashboard.tsx'
import DistrictManager from '@/features/district/DistrictManager.tsx'
import PropertyManager from '@/features/property/PropertyManager.tsx'
import ReportManager from '@/features/report/ReportManager.tsx'
import RoleManager from '@/features/role/RoleManager.tsx'
import RoomTypeManager from '@/features/roomType/RoomTypeManager.tsx'
import UserManager from '@/features/user/UserManager.tsx'
import AppLayout from '@/ui/AppLayout.tsx'
import { createBrowserRouter } from 'react-router-dom'
import CommentReportManager from './features/commentReport/CommentReportManager.tsx'
import TransactionManager from './features/transaction/TransactionManager.tsx'
import MembershipManager from './features/menbership/MembershipManager.tsx'

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
            element: <CityManager />,
            breadcrumb: 'city.list'
          },
          {
            path: ROUTER_NAMES.DISTRICT,
            element: <DistrictManager />,
            breadcrumb: 'district.list'
          },
          {
            path: ROUTER_NAMES.ROOM_TYPE,
            element: <RoomTypeManager />,
            breadcrumb: 'roomType.list'
          },
          {
            path: ROUTER_NAMES.AMENITY,
            element: <AmenityManager />,
            breadcrumb: 'amenity.list'
          },
          {
            path: ROUTER_NAMES.REPORT,
            element: <ReportManager />,
            breadcrumb: 'report.list'
          },
          {
            path: ROUTER_NAMES.ROLE,
            element: <RoleManager />,
            breadcrumb: 'role.list'
          },
          {
            path: ROUTER_NAMES.COMMENT,
            element: <CommentManager />,
            breadcrumb: 'comment.list'
          },
          {
            path: ROUTER_NAMES.USER,
            element: <UserManager />,
            breadcrumb: 'user.list'
          },
          {
            path: ROUTER_NAMES.PROPERTY,
            element: <PropertyManager />,
            breadcrumb: 'property.list'
          },
          {
            path: ROUTER_NAMES.TRANSACTION,
            element: <TransactionManager />,
            breadcrumb: 'transaction'
          },
          {
            path: ROUTER_NAMES.COMMENT_REPORT,
            element: <CommentReportManager />,
            breadcrumb: 'commentReport.list'
          },
          {
            path: ROUTER_NAMES.ADVERTISEMENT,
            element: <AdvertisementManager />,
            breadcrumb: 'advertisement.picture'
          },
          {
            path: ROUTER_NAMES.MEMBER_SHIP,
            element: <MembershipManager />,
            breadcrumb: 'memberShip.list'
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
