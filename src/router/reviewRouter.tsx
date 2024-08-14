import { RouteObject } from "react-router-dom"
import ListReview from "../features/review/ListReview"
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'

const reviewRouter: RouteObject[] & BreadcrumbsRoute[] = [
    {
        path: '/review',
        element: <ListReview/>,
        breadcrumb: "Đánh giá"
    },
]

export default reviewRouter