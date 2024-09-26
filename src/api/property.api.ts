import { Property, PropertyStatus } from '@/models/property.type.ts'
import axiosInstance from '@/axiosInstance'
import { PageInfo } from '@/models/pageInfo.type'

interface PropertyWithPagination {
  pageInfo: PageInfo
  data: Property[]
}

export interface UpdatePropertyStatus {
  id: number
  status: PropertyStatus
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

export const updatePropertyStatus = async ({ id, status }: UpdatePropertyStatus) => {
  const response = await axiosInstance.put<Property>(`/api/properties/status/${id}?status=${status}`)
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
    const response = await axiosInstance.put<Property>(`/api/properties/block/${id}?status=${status}`)
    return response.data
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
