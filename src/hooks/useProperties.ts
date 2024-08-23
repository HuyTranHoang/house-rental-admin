import { deleteProperty, getAllPropertyWithPagination, getPropertyById, updatePropertyStatus } from '@/api/property.api'
import { UpdatePropertyStatusVariables } from '@/models/property.type'
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

  const mutation = useMutation({
    mutationFn: (variables: UpdatePropertyStatusVariables) => updatePropertyStatus(variables),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công')
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}

export function useDeleteProperty() {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => deleteProperty(id),
    onSuccess: () => {
      toast.success('Xóa bài đăng thành công')
      queryClient.invalidateQueries({ queryKey: ['properies'] })
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
