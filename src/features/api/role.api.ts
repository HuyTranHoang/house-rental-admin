import { Role } from '../../models/role.type.ts'
import axiosInstance from '../../axiosInstance.ts'
import { PageInfo } from '../../models/pageInfo.type.ts'

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