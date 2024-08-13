import ListReview from '../features/review/ListReview'
import { RouteObject } from 'react-router-dom'
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'

const reviewRouter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: '/review',
    element: <ListReview />,
    breadcrumb: 'Danh sách đánh giá'
  }
]

export default reviewRouter