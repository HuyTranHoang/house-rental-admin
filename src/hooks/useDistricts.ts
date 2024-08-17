import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addDistrict,
  deleteDistricts,
  deleteDistrict,
  getAllDistrictsWithPagination,
  updateDistrict
} from '@/api/district.api'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import React from 'react'

export const useDistricts = (search: string,
                             cityId: number,
                             pageNumber: number,
                             pageSize: number,
                             sortBy: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['districts', search, cityId, pageNumber, pageSize, sortBy],
    queryFn: () => getAllDistrictsWithPagination(search, cityId, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useDeleteDistrict = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteDistrictMutate } = useMutation({
    mutationFn: deleteDistrict,
    onSuccess: () => {
      toast.success('Xóa quận huyện thành công')
      queryClient.invalidateQueries({ queryKey: ['districts'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteDistrictMutate }
}

export const useDeleteMultiDistrict = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteDistrictsMutate } = useMutation({
    mutationFn: deleteDistricts,
    onSuccess: () => {
      toast.success('Xóa các quận huyện thành công')
      queryClient.invalidateQueries({ queryKey: ['districts'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteDistrictsMutate }
}

export const useCreateDistrict = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: addDistrictMutate, isPending: addDistrictPending } = useMutation({
    mutationFn: addDistrict,
    onSuccess: () => {
      toast.success('Thêm quận huyện thành công')
      queryClient.invalidateQueries({ queryKey: ['districts'] })

      navigate('/district')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

  return { addDistrictMutate, addDistrictPending }
}

export const useUpdateDistrict = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: updateDistrictMutate, isPending: updateDistrictPending } = useMutation({
    mutationFn: updateDistrict,
    onSuccess: () => {
      toast.success('Cập nhật thành phố thành công')
      queryClient.invalidateQueries({ queryKey: ['districts'] })
      navigate('/district')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

  return { updateDistrictMutate, updateDistrictPending }
}
