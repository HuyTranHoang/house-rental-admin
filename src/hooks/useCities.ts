import {
  addCity,
  deleteCities,
  deleteCity,
  getAllCities,
  getAllCitiesWithPagination,
  updateCity
} from '@/api/city.api.ts'
import { CityFilters } from '@/models/city.type.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

export const useCitiesAll = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['cities', 'all'],
    queryFn: getAllCities
  })

  return { cityData: data, cityIsLoading: isLoading, isError }
}

export const useCities = (search: string, pageNumber: number, pageSize: number, sortBy: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['cities', search, pageNumber, pageSize, sortBy],
    queryFn: () => getAllCitiesWithPagination(search, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useDeleteCity = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteCityMutate, isPending: deleteCityPending } = useMutation({
    mutationFn: deleteCity,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['cities'] }),
    onError: (error) => toast.error(error.message)
  })

  return { deleteCityMutate, deleteCityPending }
}

export const useDeleteMultiCity = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteCitiesMutate, isPending: deleteCitiesIsPending } = useMutation({
    mutationFn: (ids: number[]) => deleteCities(ids),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['cities'] }),
    onError: (error) => toast.error(error.message)
  })

  return { deleteCitiesMutate, deleteCitiesIsPending }
}

export const useCreateCity = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: addCityMutate, isPending: addCityPending } = useMutation({
    mutationFn: addCity,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['cities'] }),
    onError: (error) => toast.error(error.message)
  })

  return { addCityMutate, addCityPending }
}

export const useUpdateCity = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: updateCityMutate, isPending: updateCityPending } = useMutation({
    mutationFn: updateCity,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['cities'] }),
    onError: (error) => toast.error(error.message)
  })

  return { updateCityMutate, updateCityPending }
}

export const useCityFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const sortBy = searchParams.get('sortBy') || ''
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '5')

  const setFilters = useCallback(
    (filters: CityFilters) => {
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
