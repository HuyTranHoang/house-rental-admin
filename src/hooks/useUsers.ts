import { deleteUser, deleteUsers, getAllUserWithPagination, lockUser, updateRoleForUser } from '@/api/user.api.ts'
import { UserFilters } from '@/models/user.type.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

export const useUsers = (
  search: string,
  isNonLocked: boolean,
  roles: string,
  pageNumber: number,
  pageSize: number,
  sortBy: string
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', search, isNonLocked, roles, pageNumber, pageSize, sortBy],
    queryFn: () => getAllUserWithPagination(search, isNonLocked, roles, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useUpdateRoleForUser = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()

  const { mutate: updateRoleForUserMutate } = useMutation({
    mutationFn: ({ id, roles }: { id: number; roles: string[] }) => updateRoleForUser(id, roles),
    onSuccess: () => {
      toast.success('Cập nhật tài khoản thành công')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })
  return { updateRoleForUserMutate }
}

export const useLockUser = () => {
  const queryClient = useQueryClient()

  const { mutate: lockUserMutate } = useMutation({
    mutationFn: lockUser,
    onSuccess: () => {
      toast.success('Thay đổi trạng thái tài khoản thành công')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { lockUserMutate }
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteUserMutate } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('Xóa tài khoản thành công')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteUserMutate }
}

export const useDeleteUsers = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteUsersMutate } = useMutation({
    mutationFn: deleteUsers,
    onSuccess: () => {
      toast.success('Xóa các tài khoản thành công')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteUsersMutate }
}

export const useUserFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const isNonLocked = searchParams.get('isNonLocked') === 'true'
  const roles = searchParams.get('roles') || ''
  const sortBy = searchParams.get('sortBy') || ''
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '5')

  const setFilters = useCallback(
    (filters: UserFilters) => {
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

          if (filters.isNonLocked !== undefined) {
            params.set('isNonLocked', String(filters.isNonLocked))
          }

          if (filters.roles !== undefined) {
            if (filters.roles) {
              params.set('roles', String(filters.roles))
            } else {
              params.delete('roles')
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

  return { search, isNonLocked, roles, sortBy, pageNumber, pageSize, setFilters }
}
