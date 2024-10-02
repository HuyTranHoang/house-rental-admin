import { getAllCommentReportsWithPagination, updateCommentReportStatus } from '@/api/commentReport.api.ts'
import { CommentReportFilters, CommentReportStatus } from '@/types/commentReport.type.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

export const useCommentReports = (
  search: string,
  category: string,
  status: CommentReportStatus,
  pageNumber: number,
  pageSize: number,
  sortBy: string
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reports', search, category, status, pageNumber, pageSize, sortBy],
    queryFn: () => getAllCommentReportsWithPagination(search, category, status, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useUpdateCommentReportStatus = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation('commentReport')

  const { mutate: updateCommentReportStatusMutate, isPending: updateCommentReportStatusPending } = useMutation({
    mutationFn: updateCommentReportStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentReports'] }).then(() => toast.success(t('toast.success')))
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { updateCommentReportStatusMutate, updateCommentReportStatusPending }
}

export const useCommentReportFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const status = (searchParams.get('status') as CommentReportStatus) || CommentReportStatus.PENDING
  const category = searchParams.get('category') || ''
  const sortBy = searchParams.get('sortBy') || ''
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '5')

  const setFilters = useCallback(
    (filters: CommentReportFilters) => {
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

          if (filters.status !== undefined) {
            if (filters.status) {
              params.set('status', filters.status)
              params.set('pageNumber', '1')
            } else {
              params.delete('status')
            }
          }

          if (filters.category !== undefined) {
            if (filters.category) {
              params.set('category', filters.category)
              params.set('pageNumber', '1')
            } else {
              params.delete('category')
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

  return { search, status, category, sortBy, pageNumber, pageSize, setFilters }
}
