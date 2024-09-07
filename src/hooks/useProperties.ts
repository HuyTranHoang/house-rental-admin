import {
  blockProperty,
  deleteProperty,
  getAllPropertyWithPagination,
  getPropertyById,
  updatePropertyStatus
} from '@/api/property.api'
import { PropertyFilters, PropertyStatus } from '@/models/property.type.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

export const useProperty = (id: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id),
    enabled: !!id
  })

  return { propertyData: data, propertyIsLoading: isLoading }
}

export function useUpdatePropertyStatus() {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: updatePropertyStatus,
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ['properties'] })
        .then(() => toast.success('Cập nhật trạng thái thành công'))
    },

    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { updatePropertyStatus: mutate, updatePropertyStatusIsPending: isPending }
}

export function useDeleteProperty() {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] }).then(() => toast.success('Xóa bài đăng thành công'))
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  return { deleteProperty: mutate, deletePropertyIsPending: isPending }
}

export const useProperties = (
  search: string,
  cityId: number,
  districtId: number,
  roomTypeId: number,
  minPrice: number,
  maxPrice: number,
  minArea: number,
  maxArea: number,
  numOfDays: number,
  status: PropertyStatus,
  pageNumber: number,
  pageSize: number,
  sortBy: string
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'properties',
      search,
      cityId,
      districtId,
      roomTypeId,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      numOfDays,
      status,
      pageNumber,
      pageSize,
      sortBy
    ],
    queryFn: () =>
      getAllPropertyWithPagination(
        search,
        cityId,
        districtId,
        roomTypeId,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
        numOfDays,
        status,
        pageNumber,
        pageSize,
        sortBy
      )
  })

  return { data, isLoading, isError }
}

export const useBlockProperty = () => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: blockProperty,
    onSuccess: (property) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] }).then(() => {
        toast.success(`Bài đăng ${property.blocked ? 'đã bị chặn' : 'đã được mở chặn'} thành công`)
      })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { blockProperty: mutate, blockPropertyIsPending: isPending }
}

export const usePropertyFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const cityId = parseInt(searchParams.get('cityId') || '0')
  const districtId = parseInt(searchParams.get('districtId') || '0')
  const roomTypeId = parseInt(searchParams.get('roomTypeId') || '0')
  const minPrice = parseInt(searchParams.get('minPrice') || '0')
  const maxPrice = parseInt(searchParams.get('maxPrice') || '0')
  const minArea = parseInt(searchParams.get('minArea') || '0')
  const maxArea = parseInt(searchParams.get('maxArea') || '0')
  const numOfDays = parseInt(searchParams.get('numOfDays') || '0')
  const status = (searchParams.get('status') as PropertyStatus) || PropertyStatus.PENDING
  const sortBy = searchParams.get('sortBy') || ''
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '5')

  const setFilters = useCallback(
    (filters: PropertyFilters) => {
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
            params.set('cityId', String(filters.cityId))
            params.set('pageNumber', '1')
          }

          if (filters.districtId !== undefined) {
            params.set('districtId', String(filters.districtId))
            params.set('pageNumber', '1')
          }

          if (filters.roomTypeId !== undefined) {
            params.set('roomTypeId', String(filters.roomTypeId))
            params.set('pageNumber', '1')
          }
          if (filters.minPrice !== undefined) {
            params.set('minPrice', String(filters.minPrice))
            params.set('pageNumber', '1')
          } else {
            params.delete('minPrice')
          }

          if (filters.maxPrice !== undefined) {
            params.set('maxPrice', String(filters.maxPrice))
            params.set('pageNumber', '1')
          } else {
            params.delete('maxPrice')
          }

          if (filters.minArea !== undefined) {
            params.set('minArea', String(filters.minArea))
            params.set('pageNumber', '1')
          } else {
            params.delete('minArea')
          }

          if (filters.maxArea !== undefined) {
            params.set('maxArea', String(filters.maxArea))
            params.set('pageNumber', '1')
          } else {
            params.delete('maxArea')
          }

          if (filters.numOfDays !== undefined) {
            params.set('numOfDays', String(filters.numOfDays))
            params.set('pageNumber', '1')
          } else {
            params.delete('numOfDays')
          }

          if (filters.status !== undefined) {
            params.set('status', filters.status)
            params.set('pageNumber', '1')
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

  return {
    search,
    cityId,
    districtId,
    roomTypeId,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    numOfDays,
    status,
    sortBy,
    pageNumber,
    pageSize,
    setFilters
  }
}
