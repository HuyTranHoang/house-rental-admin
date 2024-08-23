import { Property, UpdatePropertyStatusVariables } from '@/models/property.type.ts'
import axiosInstance from '@/axiosInstance'
import { PageInfo } from '@/models/pageInfo.type'

interface PropertyWithPagination {
  pageInfo: PageInfo
  data: Property[]
}

export const getPropertyById = async (id: number) => {
  try {
    const response = await axiosInstance.get<Property>(`/api/properties/${id}`)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy thông tin bài đăng thất bại')
  }
}
export const updatePropertyStatus = async (variables: UpdatePropertyStatusVariables) => {
  const response = await axiosInstance.put(`/api/properties/${variables.id}`, { status: variables.status })
  return response.data
}
export const deleteProperty = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/properties/${id}`)
  } catch (error) {
    console.error(error)
    throw new Error('Xóa bài đăng thất bại')
  }
}

export const getAllPropertyWithPagination = async (
  search: string,
  pageNumber: number,
  pageSize: number,
  sortBy: string,
  status: string
) => {
  try {
    pageNumber = pageNumber - 1

    const params = {
      search,
      pageNumber,
      pageSize,
      sortBy,
      status
    }

    const response = await axiosInstance.get<PropertyWithPagination>('/api/properties/admin', { params })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách bài đăng thất bại')
  }
}
