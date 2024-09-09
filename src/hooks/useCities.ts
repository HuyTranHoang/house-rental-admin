import {
  addCity,
  deleteCities,
  deleteCity,
  getAllCities,
  getAllCitiesWithPagination,
  updateCity
} from '@/api/city.api.ts'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { CityFilters } from '@/models/city.type.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  const { t } = useTranslation('langCity')

  const { mutate: deleteCityMutate, isPending: deleteCityPending } = useMutation({
    mutationFn: deleteCity,
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ['cities'] })
        .then(() => toast.success(t('city.notification.deleteSuccess')))
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteCityMutate, deleteCityPending }
}

export const useDeleteMultiCity = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteCitiesMutate } = useMutation({
    mutationFn: deleteCities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] }).then(() => toast.success('Xóa các thành phố thành công'))
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteCitiesMutate }
}

export const useCreateCity = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation('langCity')

  const { mutate: addCityMutate, isPending: addCityPending } = useMutation({
    mutationFn: addCity,
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ['cities'] })
        .then(() => toast.success(t('city.notification.addSuccess')))

      navigate(ROUTER_NAMES.CITY)
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

  return { addCityMutate, addCityPending }
}

export const useUpdateCity = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation('langCity')

  const { mutate: updateCityMutate, isPending: updateCityPending } = useMutation({
    mutationFn: updateCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] }).then(() => {
        toast.success(t('city.notification.editSuccess'))
        navigate(ROUTER_NAMES.CITY)
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
