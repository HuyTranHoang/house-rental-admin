import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteRoomType, deleteRoomTypes, getAllRoomTypesWithPagination } from '../api/roomType.api.ts'
import { toast } from 'sonner'

export const useRoomTypes = (search: string,
                             pageNumber: number,
                             pageSize: number,
                             sortBy: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['roomTypes', search, pageNumber, pageSize, sortBy],
    queryFn: () => getAllRoomTypesWithPagination(search, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useDeleteRoomType = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteRoomTypeMutate } = useMutation({
    mutationFn: deleteRoomType,
    onSuccess: () => {
      toast.success('Xóa loại phòng thành công')
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteRoomTypeMutate }
}

export const useDeleteRoomTypes = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteRoomTypesMutate } = useMutation({
    mutationFn: deleteRoomTypes,
    onSuccess: () => {
      toast.success('Xóa loại phòng thành công')
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteRoomTypesMutate }
}