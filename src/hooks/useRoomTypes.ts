import {
  addRoomType,
  deleteRoomType,
  deleteRoomTypes,
  getAllRoomTypes,
  getAllRoomTypesWithPagination, getRoomTypeById,
  updateRoomType
} from '@/api/roomType.api.ts'
import { RoomTypeFilters } from '@/models/roomType.type.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

export const useRoomTypesAll = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['roomTypes', 'all'],
    queryFn: getAllRoomTypes
  })

  return { roomTypeData: data, roomTypeIsLoading: isLoading }
}

export const useRoomType = (id: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['roomType', id],
    queryFn: () => getRoomTypeById(id),
    enabled: id !== 0
  })

  return { roomTypeData: data, roomTypeIsLoading: isLoading, isError }
}

export const useRoomTypes = (search: string, pageNumber: number, pageSize: number, sortBy: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['roomTypes', search, pageNumber, pageSize, sortBy],
    queryFn: () => getAllRoomTypesWithPagination(search, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useDeleteRoomType = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteRoomTypeMutate, isPending: deleteRoomTypeIsPending } = useMutation({
    mutationFn: deleteRoomType,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['roomTypes'] }),
    onError: (error) => toast.error(error.message)
  })

  return { deleteRoomTypeMutate, deleteRoomTypeIsPending }
}

export const useDeleteRoomTypes = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteRoomTypesMutate, isPending: deleteRoomTypesIsPending } = useMutation({
    mutationFn: deleteRoomTypes,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['roomTypes'] }),
    onError: (error) => toast.error(error.message)
  })

  return { deleteRoomTypesMutate, deleteRoomTypesIsPending }
}

export const useCreateRoomType = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: addRoomTypeMutate, isPending: addRoomTypePening } = useMutation({
    mutationFn: addRoomType,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roomTypes'] }),
    onError: (error) => toast.error(error.message)
  })

  return { addRoomTypeMutate, addRoomTypePening }
}

export const useUpdateRoomType = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: updateRoomTypeMutate, isPending: updateRoomTypePending } = useMutation({
    mutationFn: updateRoomType,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['roomTypes'] }),
    onError: (error) => toast.error(error.message)
  })

  return { updateRoomTypeMutate, updateRoomTypePending }
}

export const useRoomTypeFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const sortBy = searchParams.get('sortBy') || ''
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '5')

  const setFilters = useCallback(
    (filters: RoomTypeFilters) => {
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
