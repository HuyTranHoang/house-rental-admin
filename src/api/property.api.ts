import axiosInstance from '@/axiosInstance'
import { PageInfo } from '@/types/pageInfo.type'
import { Property, PropertyStatus } from '@/types/property.type.ts'

interface PropertyWithPagination {
  pageInfo: PageInfo
  data: Property[]
}

export interface UpdatePropertyStatus {
  id: number
  status: PropertyStatus
  reason?: string
}

export interface BlockProperty {
  id: number
  status: string
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

export const updatePropertyStatus = async ({ id, status, reason }: UpdatePropertyStatus) => {
  const params = {
    status,
    reason
  }

  const response = await axiosInstance.put<Property>(`/api/properties/status/${id}`, {}, { params })
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

export const blockProperty = async ({ id, status }: BlockProperty) => {
  try {
    await axiosInstance.put<Property>(`/api/properties/block/${id}?status=${status}`)
  } catch (error) {
    console.error(error)
    throw new Error('Thay đổi trạng thái bài đăng thất bại')
  }
}

export const getAllPropertyWithPagination = async (
  search: string,
  cityId: number,
  districtId: number,
  roomTypeId: number,
  minPrice: number,
  maxPrice: number,
  minArea: number,
  maxArea: number,
  numOfDays: number,
  status: string,
  pageNumber: number,
  pageSize: number,
  sortBy: string
) => {
  try {
    pageNumber = pageNumber - 1

    const params = {
      search,
      cityId,
      districtId,
      roomTypeId,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      numOfDays,
      status,
      pageNumber,
      pageSize,
      sortBy
    }

    const response = await axiosInstance.get<PropertyWithPagination>('/api/properties', { params })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách bài đăng thất bại')
  }
}
