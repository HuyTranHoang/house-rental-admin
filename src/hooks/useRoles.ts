import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addRole, deleteRole, deleteRoles, getAllRoles, getAllRolesWithPagination, updateRole } from '@/api/role.api.ts'
import React from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { FormInstance } from 'antd'
import { Role } from '@/types/role.type.ts'
import { useTranslation } from 'react-i18next'

export const useRolesAll = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles
  })

  return { data, isLoading, isError }
}

export const useRoles = (search: string, authorities: string, pageNumber: number, pageSize: number, sortBy: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['roles', search, authorities, pageNumber, pageSize, sortBy],
    queryFn: () => getAllRolesWithPagination(search, authorities, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useRolesWithoutParams = () => {
  const { data } = useQuery({
    queryKey: ['rolesList'],
    queryFn: () => getAllRoles()
  })

  return { data }
}

export const useCreateRole = (
  setError: React.Dispatch<React.SetStateAction<string>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  formAddRole: FormInstance
) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['common', 'role'])

  const { mutate: addRoleMutate, isPending: addRolePending } = useMutation({
    mutationFn: addRole,
    onSuccess: () => {
      toast.success(t('role:notification.addSuccess'))
      queryClient.invalidateQueries({ queryKey: ['roles'] })

      setIsModalOpen(false)
      formAddRole.resetFields()
      setError('')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

  return { addRoleMutate, addRolePending }
}

export const useUpdateRole = (
  setError: React.Dispatch<React.SetStateAction<string>>,
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>,
  formAddRole?: FormInstance,
  setCurrentRole?: React.Dispatch<React.SetStateAction<Role>>
) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['common', 'role'])


  const { mutate: updateRoleMutate, isPending: updateRolePending } = useMutation({
    mutationFn: updateRole,
    onSuccess: (data) => {
      toast.success(t('role:notification.editSuccess'))
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['role', data.id] })
      setCurrentRole && setCurrentRole(data)

      if (setIsModalOpen && formAddRole) {
        setIsModalOpen(false)
        formAddRole.resetFields()
      }

      setError('')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

  return { updateRoleMutate, updateRolePending }
}

export const useDeleteRole = () => {
  const { t } = useTranslation(['common', 'role'])
  const queryClient = useQueryClient()

  const { mutate: deleteRoleMutate, isPending: deleteRolePending } = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      toast.success(t('role:notification.deleteSuccess'))
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteRoleMutate, deleteRolePending }
}

export const useDeleteMultiRole = () => {
  const { t } = useTranslation(['common', 'role'])
  const queryClient = useQueryClient()

  const { mutate: deleteRolesMutate, isPending: deleteRolesPending } = useMutation({
    mutationFn: deleteRoles,
    onSuccess: () => {
      toast.success(t('role:notification.deleteSuccessMultiple'))
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteRolesMutate, deleteRolesPending }
}
