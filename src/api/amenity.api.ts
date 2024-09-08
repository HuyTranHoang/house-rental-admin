import { Amenity, AmenityForm } from '@/models/amenity.type.ts'
import { PageInfo } from '@/models/pageInfo.type.ts'
import axiosInstance from '@/axiosInstance.ts'

export interface AmenitiesWithPagination {
  pageInfo: PageInfo
  data: Amenity[]
}

export const getAllAmenities = async () => {
  try {
    const response = await axiosInstance.get<Amenity[]>('/api/amenity/all')
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách tiện nghi thất bại')
  }
}

export const getAllAmenitiesWithPagination = async (
  search: string,
  pageNumber: number,
  pageSize: number,
  sortBy: string
) => {
  try {
    pageNumber = pageNumber - 1

    const params = {
      name: search,
      pageNumber,
      pageSize,
      sortBy
    }

    const response = await axiosInstance.get<AmenitiesWithPagination>('/api/amenity', { params })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách tiện nghi thất bại')
  }
}

export const getAmenityById = async (id: number) => {
  try {
    const response = await axiosInstance.get<Amenity>(`/api/amenity/${id}`)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy thông tin tiện nghi thất bại')
  }
}

export const addAmenity = async (values: AmenityForm) => {
  await axiosInstance.post('/api/amenity', values)
}

export const deleteAmenity = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/amenity/${id}`)
  } catch (error) {
    console.error(error)
    throw new Error('Xóa tiện nghi thất bại')
  }
}

export const updateAmenity = async (values: AmenityForm) => {
  await axiosInstance.put(`/api/amenity/${values.id}`, values)
}

export const deleteAmenities = async (ids: number[]) => {
  try {
    await axiosInstance.delete('/api/amenity/delete-multiple', { data: { ids } })
  } catch (error) {
    console.error(error)
    throw new Error('Xóa các tiện nghi thất bại')
  }
}
