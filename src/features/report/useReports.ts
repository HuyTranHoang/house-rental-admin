import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllReportsWithPagination, updateReportStatus } from '../api/report.api.ts'
import { ReportStatus } from '../../models/report.type.ts'
import { toast } from 'sonner'

export const useReports = (search: string,
                           category: string,
                           status: ReportStatus,
                           pageNumber: number,
                           pageSize: number,
                           sortBy: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reports', search, category, status, pageNumber, pageSize, sortBy],
    queryFn: () => getAllReportsWithPagination(search, category, status, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient()

  const { mutate: updateReportStatusMutate, isPending: updateReportStatusPending } = useMutation({
    mutationFn: updateReportStatus,
    onSuccess: () => {
      toast.success('Xét duyệt báo cáo thành công')
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { updateReportStatusMutate, updateReportStatusPending }
}
