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
import { useTranslation } from 'react-i18next'

export const useAmenities = (search: string, pageNumber: number, pageSize: number, sortBy: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['amenities', search, pageNumber, pageSize, sortBy],
    queryFn: () => getAllAmenitiesWithPagination(search, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useDeleteAmenity = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation('amenity')

  const { mutate: deleteAmenityMutate, isPending: deleteAmenityPending } = useMutation({
    mutationFn: deleteAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] })
      .then(() => toast.success(t('amenity.notification.deleteSuccess', { count: 1 })))
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteAmenityMutate , deleteAmenityPending }
}

export const useDeleteMultiAmenity = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation('amenity')

  const { mutate: deleteAmenitiesMutate } = useMutation({
    mutationFn: (ids: number[]) => deleteAmenities(ids),
    onSuccess: (_, variables) => {
      queryClient
        .invalidateQueries({ queryKey: ['amenities'] })
        .then(() => toast.success(t('amenity.notification.deleteSuccess', { count: variables.length })))
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
  const { t } = useTranslation('amenity')

  const { mutate: addAmenityMutate, isPending: addAmenityPending } = useMutation({
    mutationFn: addAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] })
      .then(() => 
        toast.success(t('amenity.notification.addSuccess')))
        navigate(ROUTER_NAMES.AMENITY)
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
  const { t } = useTranslation('amenity')

  const { mutate: updateAmenityMutate, isPending: updateAmenityPending } = useMutation({
    mutationFn: updateAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] }).then(() => {
        toast.success(t('amenity.notification.editSuccess'))
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