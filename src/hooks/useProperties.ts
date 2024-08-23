import { deleteProperty, getAllPropertyWithPagination, getPropertyById, updatePropertyStatus } from '@/api/property.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const usePropertyById = (id: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id),
    enabled: !!id
  })

  return { propertyData: data, propertyIsLoading: isLoading }
}

export function useUpdatePropertyStatus() {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: updatePropertyStatus,
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ['properties'] })
        .then(() => toast.success('Cập nhật trạng thái thành công'))
    },

    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { updatePropertyStatus: mutate, updatePropertyStatusIsPending: isPending }
}

export function useDeleteProperty() {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] }).then(() => toast.success('Xóa bài đăng thành công'))
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  return { deleteProperty: mutate, deletePropertyIsPending: isPending }
}

export const useProperty = (search: string, pageNumber: number, pageSize: number, sortBy: string, status: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['properties', search, pageNumber, pageSize, sortBy, status],
    queryFn: () => getAllPropertyWithPagination(search, pageNumber, pageSize, sortBy, status)
  })

  return { data, isLoading, isError }
}
