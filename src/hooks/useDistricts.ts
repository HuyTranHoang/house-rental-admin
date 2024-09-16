import {
  addDistrict,
  deleteDistrict,
  deleteDistricts,
  getAllDistricts,
  getAllDistrictsWithPagination,
  updateDistrict
} from '@/api/district.api'
import { DistrictFilters } from '@/models/district.type.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

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

  const { mutateAsync: deleteDistrictMutate, isPending: deleteDistrictPending } = useMutation({
    mutationFn: deleteDistrict,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['district'] }),
    onError: (error) => toast.error(error.message)
  })

  return { deleteDistrictMutate, deleteDistrictPending }
}

export const useDeleteMultiDistrict = () => {
  const queryClient = useQueryClient()


  const { mutateAsync: deleteDistrictsMutate, isPending: deleteDistrictsPending } = useMutation({
    mutationFn: (ids: number[]) => deleteDistricts(ids),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['districts'] }),
    onError: (error) => toast.error(error.message)
  })

  return { deleteDistrictsMutate, deleteDistrictsPending }
}

export const useCreateDistrict = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: addDistrictMutate, isPending: addDistrictPending } = useMutation({
    mutationFn: addDistrict,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['districts'] }),
    onError: (error) => toast.error(error.message)
  })

  return { addDistrictMutate, addDistrictPending }
}

export const useUpdateDistrict = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: updateDistrictMutate, isPending: updateDistrictPending } = useMutation({
    mutationFn: updateDistrict,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['districts'] }),
    onError: (error) => toast.error(error.message)
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
              params.set('pageNumber', '1')
            } else {
              params.delete('search')
            }
          }

          if (filters.cityId !== undefined) {
            if (filters.cityId) {
              params.set('cityId', String(filters.cityId))
              params.set('pageNumber', '1')
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
