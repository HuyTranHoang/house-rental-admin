import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addRoomType,
  deleteRoomType,
  deleteRoomTypes,
  getAllRoomTypesWithPagination,
  updateRoomType
} from '@/api/roomType.api.ts'
import { toast } from 'sonner'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import ROUTER_NAMES from '@/constant/routerNames.ts'

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
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
        .then(() => toast.success('Xóa loại phòng thành công'))
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
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
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
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
        .then(() => {
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
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
        .then(() => {
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