import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addRole, deleteRole, deleteRoles, getAllRolesWithPagination, updateRole } from '@/api/role.api.ts'
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

export const useUpdateRole = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: updateRoleMutate, isPending: updateRolePending } = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      toast.success('Cập nhật vai trò thành công')
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

  return { updateRoleMutate, updateRolePending }
}

export const useDeleteRole = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteRoleMutate, isPending: deleteRolePending } = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      toast.success('Xóa vai trò thành công')
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteRoleMutate, deleteRolePending }
}

export const useDeleteMultiRole = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteRolesMutate, isPending: deleteRolesPending } = useMutation({
    mutationFn: deleteRoles,
    onSuccess: () => {
      toast.success('Xóa các vai trò thành công')
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteRolesMutate, deleteRolesPending }
}