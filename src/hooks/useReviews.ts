import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteReview, deleteReviews, getAllReviewsWithPagination } from '../api/review.api'
import { toast } from 'sonner'


export const useReviews = (search: string,
                           rating: number,
                           pageNumber: number,
                           pageSize: number,
                           sortBy: string) => {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['reviews', search, rating, pageNumber, pageSize, sortBy],
    queryFn: () => getAllReviewsWithPagination(search, rating, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteReviewMutate } = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success('Xóa đánh giá thành công')
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteReviewMutate }
}

export const useDeleteMultiReview = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteReviewsMutate } = useMutation({
    mutationFn: deleteReviews,
    onSuccess: () => {
      toast.success('Xóa các đánh giá thành công')
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteReviewsMutate }
}