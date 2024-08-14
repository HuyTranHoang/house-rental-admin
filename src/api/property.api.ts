import axios from 'axios'
import { Property } from '@/models/property.type.ts'
import axiosInstance from '@/axiosInstance'
import { PageInfo } from '@/models/pageInfo.type'

interface PropertyWithPagination {
  pageInfo: PageInfo
  data: Property[]
}

export const getPropertyById = async (id: number) => {
  try {
    const response = await axios.get<Property>(`/api/properties/${id}`)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy thông tin bài đăng thất bại')
  }
}
export const deleteProperty = async (id: number): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`/api/properties/${id}`);
    if (response.status !== 200) {
      throw new Error('Không thể xóa bài đăng');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Xóa bài đăng thất bại');
  }
}

export const getAllPropertyWithPagination = async (
    search : string ,
    roomTypeId : number,
    numOfDay : number,
    minPrice : number,
    maxPrice : number,
    minArea : number,
    maxArea : number,
    dictrictId : number,
    cityId : number,
    pageNumber : number,
    pageSize : number,
    sortBy : string,
    status : string
) => {
try {
    pageNumber = pageNumber - 1

const params = {
    search,
    roomTypeId,
    numOfDay,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    dictrictId,
    cityId,
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