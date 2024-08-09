import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addAmenity,
  deleteAmenities,
  deleteAmenity,
  getAllAmenitiesWithPagination,
  updateAmenity
} from '../features/api/amenity.api.ts'
import { toast } from 'sonner'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const useAmenities = (search: string,
                             pageNumber: number,
                             pageSize: number,
                             sortBy: string) => {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['amenities', search, pageNumber, pageSize, sortBy],
    queryFn: () => getAllAmenitiesWithPagination(search, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useDeleteAmenity = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteAmenityMutate } = useMutation({
    mutationFn: deleteAmenity,
    onSuccess: () => {
      toast.success('Xóa tiện nghi thành công')
      queryClient.invalidateQueries({ queryKey: ['amenities'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteAmenityMutate }
}

export const useDeleteMultiAmenity = () => {
  const queryClient = useQueryClient()


  const { mutate: deleteAmenitiesMutate } = useMutation({
    mutationFn: deleteAmenities,
    onSuccess: () => {
      toast.success('Xóa các tiện nghi thành công')
      queryClient.invalidateQueries({ queryKey: ['amenities'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteAmenitiesMutate }
}

export const useCreateAmenity = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: addAmenityMutate, isPending: addAmenityPending } = useMutation({
    mutationFn: addAmenity,
    onSuccess: () => {
      toast.success('Thêm tiện nghi thành công')
      queryClient.invalidateQueries({ queryKey: ['amenities'] })

      navigate('/amenity')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

  return { addAmenityMutate, addAmenityPending }
}

export const useUpdateAmenity = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: updateAmenityMutate, isPending: updateAmenityPending } = useMutation({
    mutationFn: updateAmenity,
    onSuccess: () => {
      toast.success('Thêm tiện nghi thành công')
      queryClient.invalidateQueries({ queryKey: ['amenities'] })

      navigate('/amenity')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

  return { updateAmenityMutate, updateAmenityPending }
}