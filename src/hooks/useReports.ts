import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllReportsWithPagination, updateReportStatus } from '@/api/report.api.ts'
import { ReportFilters, ReportStatus } from '../models/report.type.ts'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export const useReports = (
  search: string,
  category: string,
  status: ReportStatus,
  pageNumber: number,
  pageSize: number,
  sortBy: string
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reports', search, category, status, pageNumber, pageSize, sortBy],
    queryFn: () => getAllReportsWithPagination(search, category, status, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation('report')

  const { mutate: updateReportStatusMutate, isPending: updateReportStatusPending } = useMutation({
    mutationFn: updateReportStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] }).then(() => toast.success(t('toast.success')))
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { updateReportStatusMutate, updateReportStatusPending }
}

export const useReportFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const status = (searchParams.get('status') as ReportStatus) || ReportStatus.PENDING
  const category = searchParams.get('category') || ''
  const sortBy = searchParams.get('sortBy') || ''
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '5')

  const setFilters = useCallback(
    (filters: ReportFilters) => {
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
