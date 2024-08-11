import axios from 'axios'
import { Amenity } from '@/models/amenity.type.ts'
import { PageInfo } from '@/models/pageInfo.type.ts'
import { delay } from '@/utils/delay.ts'
import axiosInstance from '@/axiosInstance.ts'

export interface AmenityField {
  id?: number
  name: string
}

export interface AmenitiesWithPagination {
  pageInfo: PageInfo
  data: Amenity[]
}

export const getAllAmenities = async () => {
  try {
    const response = await axios.get<Amenity[]>('/api/amenities/all')
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

    const response = await axios.get<AmenitiesWithPagination>('/api/amenities', { params })

    await delay(300)

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
    const response = await axios.get<Amenity>(`/api/amenities/${id}`)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy thông tin tiện nghi thất bại')
  }
}

export const addAmenity = async (values: AmenityField) => {
  await axiosInstance.post('/api/amenities', values)
}

export const deleteAmenity = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/amenities/${id}`)
  } catch (error) {
    console.error(error)
    throw new Error('Xóa tiện nghi thất bại')
  }
}

export const updateAmenity = async (values: AmenityField) => {
  await axiosInstance.put(`/api/amenities/${values.id}`, values)
}

export const deleteAmenities = async (ids: number[]) => {
  try {
    await axiosInstance.delete('/api/amenities/delete-multiple', { data: { ids } })
  } catch (error) {
    console.error(error)
    throw new Error('Xóa các tiện nghi thất bại')
  }
}
