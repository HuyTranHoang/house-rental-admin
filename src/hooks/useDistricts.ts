import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addDistrict,
  deleteDistrict,
  deleteDistricts,
  getAllDistricts,
  getAllDistrictsWithPagination,
  updateDistrict
} from '@/api/district.api'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import React, { useCallback } from 'react'
import { DistrictFilters } from '@/models/district.type.ts'
import ROUTER_NAMES from '@/constant/routerNames.ts'

export const useDistrictsAll = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['districts'],
    queryFn: getAllDistricts
  })

  return { districtData: data, districtIsLoading: isLoading, isError }
}

export const useDistricts = (search: string, cityId: number, pageNumber: number, pageSize: number, sortBy: string) => {
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
      queryClient.invalidateQueries({ queryKey: ['districts'] }).then(() => toast.success('Xóa quận huyện thành công'))
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
      queryClient
        .invalidateQueries({ queryKey: ['districts'] })
        .then(() => toast.success('Xóa các quận huyện thành công'))
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
      queryClient.invalidateQueries({ queryKey: ['districts'] }).then(() => {
        toast.success('Thêm quận huyện thành công')
        navigate(ROUTER_NAMES.DISTRICT)
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

  return { addDistrictMutate, addDistrictPending }
}

export const useUpdateDistrict = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: updateDistrictMutate, isPending: updateDistrictPending } = useMutation({
    mutationFn: updateDistrict,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts'] }).then(() => {
        toast.success('Cập nhật thành phố thành công')
        navigate(ROUTER_NAMES.DISTRICT)
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

  return { updateDistrictMutate, updateDistrictPending }
}

export const useDistrictFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const cityId = parseInt(searchParams.get('cityId') || '0')
  const sortBy = searchParams.get('sortBy') || ''
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '5')

  const setFilters = useCallback(
    (filters: DistrictFilters) => {
      setSearchParams(
        (params) => {
          if (filters.search !== undefined) {
            if (filters.search) {
              params.set('search', filters.search)
            } else {
              params.delete('search')
            }
          }

          if (filters.cityId !== undefined) {
            if (filters.cityId) {
              params.set('cityId', String(filters.cityId))
            } else {
              params.delete('cityId')
            }
          }

          if (filters.sortBy !== undefined) {
            if (filters.sortBy) {
              params.set('sortBy', filters.sortBy)
            } else {
              params.delete('sortBy')
            }
          }

          if (filters.pageNumber !== undefined) {
            params.set('pageNumber', String(filters.pageNumber))
          }

          if (filters.pageSize !== undefined) {
            params.set('pageSize', String(filters.pageSize))
          }

          return params
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  return { search, cityId, sortBy, pageNumber, pageSize, setFilters }
}
