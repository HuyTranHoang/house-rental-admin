import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addRoomType,
  deleteRoomType,
  deleteRoomTypes,
  getAllRoomTypes,
  getAllRoomTypesWithPagination,
  updateRoomType
} from '@/api/roomType.api.ts'
import { toast } from 'sonner'
import axios from 'axios'
import React, { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { RoomTypeFilters } from '@/models/roomType.type.ts'

export const useRoomTypesAll = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['roomTypes', 'all'],
    queryFn: getAllRoomTypes
  })

  return { roomTypeData: data, roomTypeIsLoading: isLoading }
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

  const { mutate: deleteRoomTypeMutate } = useMutation({
    mutationFn: deleteRoomType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] }).then(() => toast.success('Xóa loại phòng thành công'))
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
      queryClient
        .invalidateQueries({ queryKey: ['roomTypes'] })
        .then(() => toast.success('Xóa các loại phòng thành công'))
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteRoomTypesMutate }
}

export const useCreateRoomType = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: addRoomTypeMutate, isPending: addRoomTypePening } = useMutation({
    mutationFn: addRoomType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] }).then(() => {
        toast.success('Thêm loại phòng thành công')
        navigate(ROUTER_NAMES.ROOM_TYPE)
      })
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

  return { addRoomTypeMutate, addRoomTypePening }
}

export const useUpdateRoomType = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: updateRoomTypeMutate, isPending: updateRoomTypePending } = useMutation({
    mutationFn: updateRoomType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] }).then(() => {
        toast.success('Cập nhật loại phòng thành công')
        navigate(ROUTER_NAMES.ROOM_TYPE)
      })
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
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