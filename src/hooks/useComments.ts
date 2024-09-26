import { CommentFilters } from '@/types/comment.type.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { deleteComment, deleteComments, getAllCommentWithPagination } from '../api/comment.api.ts'

export const useComments = (search: string, pageNumber: number, pageSize: number, sortBy: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reviews', search, pageNumber, pageSize, sortBy],
    queryFn: () => getAllCommentWithPagination(search, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()
  const { mutate: deleteCommentMutate, isPending: deleteCommentIsPending } = useMutation({
    mutationFn: deleteComment,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['reviews'] }),
    onError: (error) => toast.error(error.message)
  })

  return { deleteCommentMutate, deleteCommentIsPending }
}

export const useDeleteMultiComment = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteCommentsMutate, isPending: deleteCommentsIsPending } = useMutation({
    mutationFn: deleteComments,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['reviews'] }),
    onError: (error) => toast.error(error.message)
  })

  return { deleteCommentsMutate, deleteCommentsIsPending }
}

export const useReviewFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const sortBy = searchParams.get('sortBy') || ''
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '5')

  const setFilters = useCallback(
    (filters: CommentFilters) => {
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

  return { search, sortBy, pageNumber, pageSize, setFilters }
}
