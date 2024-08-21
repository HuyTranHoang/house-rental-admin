import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addAmenity,
  deleteAmenities,
  deleteAmenity,
  getAllAmenitiesWithPagination,
  updateAmenity
} from '@/api/amenity.api.ts'
import { toast } from 'sonner'
import axios from 'axios'
import React, { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { CityFilters } from '@/models/city.type.ts'

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
      queryClient.invalidateQueries({ queryKey: ['amenities'] })
        .then(() => toast.success('Xóa tiện nghi thành công'))
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
      queryClient.invalidateQueries({ queryKey: ['amenities'] })
        .then(() => toast.success('Xóa các tiện nghi thành công'))
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
      queryClient.invalidateQueries({ queryKey: ['amenities'] })
        .then(() => {
          toast.success('Thêm tiện nghi thành công')
          navigate(ROUTER_NAMES.AMENITY)
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

  return { addAmenityMutate, addAmenityPending }
}

export const useUpdateAmenity = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: updateAmenityMutate, isPending: updateAmenityPending } = useMutation({
    mutationFn: updateAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] })
        .then(() => {
          toast.success('Thêm tiện nghi thành công')
          navigate(ROUTER_NAMES.AMENITY)
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

  return { updateAmenityMutate, updateAmenityPending }
}

export const useAmenityFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const sortBy = searchParams.get('sortBy') || ''
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '5')

  const setFilters = useCallback((filters: CityFilters) => {
    setSearchParams((params) => {
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
    }, { replace: true })
  }, [setSearchParams])

  return { search, sortBy, pageNumber, pageSize, setFilters }
}