import { ReviewFilters } from '@/models/review.type.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { deleteReview, deleteReviews, getAllReviewsWithPagination } from '../api/review.api'

export const useReviews = (search: string, rating: number, pageNumber: number, pageSize: number, sortBy: string) => {
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

export const useReviewFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const rating = parseInt(searchParams.get('rating') || '0')
  const sortBy = searchParams.get('sortBy') || ''
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '5')

  const setFilters = useCallback(
    (filters: ReviewFilters) => {
      setSearchParams(
        (params) => {
          if (filters.search !== undefined) {
            if (filters.search) {
              params.set('search', filters.search)
              params.set('pageNumber', '1')
            } else {
              params.delete('search')
            }
          }

          if (filters.rating !== undefined) {
            if (filters.rating) {
              params.set('rating', String(filters.rating))
              params.set('pageNumber', '1')
            } else {
              params.delete('rating')
            }
          }

          if (filters.pageNumber !== undefined) {
            params.set('pageNumber', String(filters.pageNumber))
          }

          if (filters.pageSize !== undefined) {
            params.set('pageSize', String(filters.pageSize))
          }

          if (filters.sortBy !== undefined) {
            if (filters.sortBy) {
              params.set('sortBy', filters.sortBy)
            } else {
              params.delete('sortBy')
            }
          }

          return params
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  return { search, rating, sortBy, pageNumber, pageSize, setFilters }
}
