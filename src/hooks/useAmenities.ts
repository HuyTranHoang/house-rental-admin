import {
  addAmenity,
  deleteAmenities,
  deleteAmenity,
  getAllAmenitiesWithPagination, getAmenityById,
  updateAmenity
} from '@/api/amenity.api.ts'
import { CityFilters } from '@/models/city.type.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

export const useAmenities = (search: string, pageNumber: number, pageSize: number, sortBy: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['amenities', search, pageNumber, pageSize, sortBy],
    queryFn: () => getAllAmenitiesWithPagination(search, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useAmenity = (id: number) => {
  const { data: amenityData, isLoading: amenityIsLoading, isError } = useQuery({
    queryKey: ['amenity', id],
    queryFn: () => getAmenityById(id),
    enabled: id !== 0
  })

  return { amenityData, amenityIsLoading, isError }
}

export const useDeleteAmenity = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteAmenityMutate, isPending: deleteAmenityPending } = useMutation({
    mutationFn: deleteAmenity,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['amenities'] }),
    onError: (error) => toast.error(error.message)
  })

  return { deleteAmenityMutate, deleteAmenityPending }
}

export const useDeleteMultiAmenity = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteAmenitiesMutate, isPending: deleteAmenitiesIsPending } = useMutation({
    mutationFn: deleteAmenities,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['amenities'] }),
    onError: (error) => toast.error(error.message)
  })

  return { deleteAmenitiesMutate, deleteAmenitiesIsPending }
}

export const useCreateAmenity = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: addAmenityMutate, isPending: addAmenityPending } = useMutation({
    mutationFn: addAmenity,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['amenities'] }),
    onError: (error) => toast.error(error.message)
  })

  return { addAmenityMutate, addAmenityPending }
}

export const useUpdateAmenity = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: updateAmenityMutate, isPending: updateAmenityPending } = useMutation({
    mutationFn: updateAmenity,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['amenities'] }),
    onError: (error) => toast.error(error.message)
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
