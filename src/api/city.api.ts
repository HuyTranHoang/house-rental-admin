import axios from 'axios'
import { City, CityFormType } from '@/types/city.type.ts'
import { PageInfo } from '@/types/pageInfo.type.ts'
import axiosInstance from '@/axiosInstance.ts'

interface CitiesWithPagination {
  pageInfo: PageInfo
  data: City[]
}

export const getAllCities = async () => {
  try {
    const response = await axios.get<City[]>('/api/city/all')
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách thành phố thất bại')
  }
}

export const getAllCitiesWithPagination = async (
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

    const response = await axios.get<CitiesWithPagination>('/api/city', { params })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách thành phố thất bại')
  }
}

export const getCityById = async (id: number) => {
  try {
    const response = await axios.get<City>(`/api/city/${id}`)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy thông tin thành phố thất bại')
  }
}

export const addCity = async (values: CityFormType) => {
  await axiosInstance.post('/api/city', values)
}

export const deleteCity = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/city/${id}`)
  } catch (error) {
    console.error(error)
    throw new Error('Xóa thành phố thất bại')
  }
}

export const updateCity = async (values: CityFormType) => {
  await axiosInstance.put(`/api/city/${values.id}`, values)
}

export const deleteCities = async (ids: number[]) => {
  try {
    await axiosInstance.delete('/api/city/delete-multiple', { data: { ids } })
  } catch (error) {
    console.error(error)
    throw new Error('Xóa các thành phố thất bại')
  }
}