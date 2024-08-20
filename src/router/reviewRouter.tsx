import ListReview from '../features/review/ListReview'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'
import ROUTER_NAMES from '@/constant/routerNames.ts'

const reviewRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: ROUTER_NAMES.REVIEW,
    element: <ListReview />,
    breadcrumb: 'Danh sách đánh giá'
  }
]

export default reviewRouter
