import { User } from '@/types/user.type.ts'
import axiosInstance from '@/axiosInstance'
import { PageInfo } from '@/types/pageInfo.type.ts'

interface UsersWithPagination {
  data: User[]
  pageInfo: PageInfo
}

export interface UserField {
  id: number
  username: string
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  avatarUrl: string
  roles: string[]
  authorities: string[]
  active: boolean
  nonLocked: boolean
}

export const getAllUserWithPagination = async (
  search: string,
  isNonLocked: boolean,
  roles: string,
  pageNumber: number,
  pageSize: number,
  sortBy: string
) => {
  try {
    pageNumber = pageNumber - 1

    const params = {
      search,
      isNonLocked,
      roles,
      pageNumber,
      pageSize,
      sortBy
    }

    const response = await axiosInstance.get<UsersWithPagination>('/api/user', { params })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách người dùng thất bại')
  }
}

export const updateRoleForUser = async (id: number, roles: string[]) => {
  await axiosInstance.put(`/api/user/update-role/${id}`, { roles })
}

export const lockUser = async (id: number) => {
  try {
    await axiosInstance.put(`/api/user/lock/${id}`)
  } catch (error) {
    console.error(error)
    throw new Error('Khoá tài khoản thất bại')
  }
}

export const deleteUser = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/user/${id}`)
  } catch (error) {
    console.error(error)
    throw new Error('Xoá tài khoản thất bại')
  }
}

export const deleteUsers = async (ids: number[]) => {
  try {
    await axiosInstance.delete('/api/user/delete-multiple', { data: { ids } })
  } catch (error) {
    console.error(error)
    throw new Error('Xóa các tài khoản thất bại')
  }
}
