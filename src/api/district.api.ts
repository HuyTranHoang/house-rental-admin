import axios from 'axios'
import { District } from '@/models/district.type'
import { PageInfo } from '@/models/pageInfo.type.ts'
import axiosInstance from '@/axiosInstance.ts'
import { DistrictForm } from '@/features/district/AddUpdateDistrict.tsx'

interface DistrictsWithPagination {
  pageInfo: PageInfo
  data: District[]
}

export const getAllDistricts = async () => {
  try {
    const response = await axios.get<District[]>('/api/district/all')
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách quận huyện thất bại')
  }
}

export const getAllDistrictsWithPagination = async (
  search: string,
  cityId: number,
  pageNumber: number,
  pageSize: number,
  sortBy: string
) => {
  try {
    pageNumber = pageNumber - 1

    const params = {
      name: search,
      cityId,
      pageNumber,
      pageSize,
      sortBy
    }

    const response = await axios.get<DistrictsWithPagination>('/api/district', { params })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách quận huyện thất bại')
  }
}

export const getDistrictById = async (id: number) => {
  try {
    const response = await axios.get<District>(`/api/district/${id}`)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy thông tin quận huyện thất bại')
  }
}

export const addDistrict = async (values: DistrictForm) => {
  await axiosInstance.post('/api/district', values)
}

export const deleteDistrict = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/district/${id}`)
  } catch (error) {
    console.error(error)
    throw new Error('Xóa quận huyện thất bại')
  }
}

export const updateDistrict = async (values: DistrictForm) => {
  await axiosInstance.put(`/api/district/${values.id}`, values)
}

export const deleteDistricts = async (ids: number[]) => {
  try {
    await axiosInstance.delete('/api/district/delete-multiple', { data: { ids } })
  } catch (error) {
    console.error(error)
    throw new Error('Xóa các quận huyện thất bại')
  }
}
