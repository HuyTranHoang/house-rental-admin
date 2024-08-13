import { Role } from '@/models/role.type.ts'
import axiosInstance from '@/axiosInstance.ts'
import { PageInfo } from '@/models/pageInfo.type.ts'
import axios from 'axios'

export interface RoleField {
  id?: number
  name: string
  description: string
  authorityPrivileges: string[]
  authorityPrivilegesObject: { [key: string]: boolean | undefined }
}

interface RolesWithPagination {
  pageInfo: PageInfo
  data: Role[]
}

export const getAllRoles = async () => {
  try {
    const response = await axiosInstance.get<Role[]>('/api/roles/all')
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách vai trò thất bại')
  }
}

export const getAllRolesWithPagination = async (search: string,
                                                authorities: string,
                                                pageNumber: number,
                                                pageSize: number,
                                                sortBy: string) => {
  try {
    pageNumber = pageNumber - 1

    const params = {
      name: search,
      authorities,
      pageNumber,
      pageSize,
      sortBy
    }

    const response = await axiosInstance.get<RolesWithPagination>('/api/roles', { params })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách vai trò thất bại')
  }
}

export const getRoleById = async (id: number) => {
  try {
    const response = await axiosInstance.get<Role>(`/api/roles/${id}`)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy vai trò thất bại')
  }
}

export const addRole = async (values: RoleField) => {
  await axiosInstance.post('/api/roles', values)
}

export const updateRole = async (values: RoleField) => {
  await axiosInstance.put(`/api/roles/${values.id}`, values)
}

export const deleteRole = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/roles/${id}`)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Xóa vai trò thất bại')
  }
}

export const deleteRoles = async (ids: number[]) => {
  try {
    await axiosInstance.delete('/api/roles/delete-multiple', { data: { ids } })
  } catch (error) {
    console.error(error)
    throw new Error('Xóa các vai trò thất bại')
  }
}