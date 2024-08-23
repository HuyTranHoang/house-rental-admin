import { deleteProperty, getAllPropertyWithPagination, getPropertyById, updatePropertyStatus } from '@/api/property.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'
import { PropertyFilters, PropertyStatus } from '@/models/property.type.ts'

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
  status: PropertyStatus,
  pageNumber: number,
  pageSize: number,
  sortBy: string
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['properties', search, cityId, districtId, status, pageNumber, pageSize, sortBy],
    queryFn: () => getAllPropertyWithPagination(search, cityId, districtId, status, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const usePropertyFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const cityId = parseInt(searchParams.get('cityId') || '0')
  const districtId = parseInt(searchParams.get('districtId') || '0')
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

          if (filters.status !== undefined) {
            params.set('status', filters.status)
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

  return { search, cityId, districtId, status, sortBy, pageNumber, pageSize, setFilters }
}
