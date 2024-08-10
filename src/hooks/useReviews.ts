import { useQuery } from "@tanstack/react-query"
import { getAllReviewsWithPagination } from "../features/api/review.api"


export const useReviews = (search: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string) => {

    const { data, isLoading, isError } = useQuery({
    queryKey: ['reviews', search, pageNumber, pageSize, sortBy],
    queryFn: () => getAllReviewsWithPagination(search, pageNumber, pageSize, sortBy)
    })

    return { data, isLoading, isError }
}