
import { delay } from '@/utils/delay.ts'
import { User } from '@/models/user.type.ts'
import axiosInstance from '@/axiosInstance'

interface UsersWithPagination {
  data: User[]
  total: number
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

export const getAllUserWithPagination = async (search: string, isNonLocked: boolean, roles:string, pageNumber: number, pageSize: number, sortBy: string) => {
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

    await delay(300) 

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách người dùng thất bại')
  }
}

export const updateUser = async (values: UserField) => {
  await axiosInstance.put(`/api/user/${values.id}`, values)
}

