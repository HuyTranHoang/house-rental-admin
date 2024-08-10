import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addRole, getAllRolesWithPagination } from '../features/api/role.api.ts'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'

export const useRoles = (search: string,
                         authorities: string,
                         pageNumber: number,
                         pageSize: number,
                         sortBy: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['roles', search, authorities, pageNumber, pageSize, sortBy],
    queryFn: () => getAllRolesWithPagination(search, authorities, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useCreateRole = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: addRoleMutate, isPending: addRolePending } = useMutation({
    mutationFn: addRole,
    onSuccess: () => {
      toast.success('Thêm vai trò thành công')
      queryClient.invalidateQueries({ queryKey: ['roles'] })

      navigate('/role')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

  return { addRoleMutate, addRolePending }
}