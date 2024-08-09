import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addRoomType,
  deleteRoomType,
  deleteRoomTypes,
  getAllRoomTypesWithPagination,
  updateRoomType
} from '../features/api/roomType.api.ts'
import { toast } from 'sonner'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

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
      toast.success('Xóa các loại phòng thành công')
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
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
      toast.success('Thêm loại phòng thành công')
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })

      navigate('/roomType')
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
      toast.success('Cập nhật loại phòng thành công')
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
      navigate('/roomType')
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