import { deleteUser, deleteUsers, getAllUserWithPagination, lockUser, updateRoleForUser } from '@/api/user.api.ts'
import { UserFilters } from '@/types/user.type.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
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

export const useUpdateRoleForUser = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: updateRoleForUserMutate, isPending: updateRoleForUserIsPending } = useMutation({
    mutationFn: ({ id, roles }: { id: number; roles: string[] }) => updateRoleForUser(id, roles),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['users'] }),
    onError: (error) => toast.error(error.message)
  })
  return { updateRoleForUserMutate, updateRoleForUserIsPending }
}

export const useLockUser = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: lockUserMutate, isPending: lockUserIsPending } = useMutation({
    mutationFn: lockUser,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['users'] }),
    onError: (error) => toast.error(error.message)
  })

  return { lockUserMutate, lockUserIsPending }
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteUserMutate, isPending: deleteUserIsPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['users'] }),
    onError: (error) => toast.error(error.message)
  })

  return { deleteUserMutate, deleteUserIsPending }
}

export const useDeleteUsers = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteUsersMutate, isPending: deleteUsersIsPending } = useMutation({
    mutationFn: deleteUsers,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['users'] }),
    onError: (error) => toast.error(error.message)
  })

  return { deleteUsersMutate, deleteUsersIsPending }
}

export const useUserFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const isNonLocked = searchParams.get('isNonLocked') ? searchParams.get('isNonLocked') === 'true' : true
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
            params.set('pageNumber', '1')
          }

          if (filters.roles !== undefined) {
            if (filters.roles) {
              params.set('roles', String(filters.roles))
              params.set('pageNumber', '1')
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
