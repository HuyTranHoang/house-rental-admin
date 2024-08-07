import axios from 'axios'
import { CityType } from '../../models/city.type.ts'
import { PageInfo } from '../../models/pageInfo.type.ts'
import axiosInstance from '../../axiosInstance.ts'

export type CityField = {
  id?: number;
  name: string;
};

interface CitiesWithPagination {
  pageInfo: PageInfo
  data: CityType[]
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getAllCities = async () => {
  try {
    const response = await axios.get<CityType[]>('/api/city/all')
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách thành phố thất bại')
  }
}

export const getAllCitiesWithPagination = async (search: string, pageNumber: number, pageSize: number, sortBy: string) => {
  try {
    pageNumber = pageNumber - 1

    const params = {
      name: search,
      pageNumber,
      pageSize,
      sortBy
    }

    const response = await axios.get<CitiesWithPagination>('/api/city', { params })

    await delay(300) // Giả delay 300ms để thấy rõ sự chuyển động của loading

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
    const response = await axios.get<CityType>(`/api/city/${id}`)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy thông tin thành phố thất bại')
  }
}

export const addCity = async (values: CityField) => {
  try {
    await axiosInstance.post('/api/city', values)
  } catch (error) {
    console.error(error)
    throw new Error('Thêm thành phố thất bại')
  }
}

export const deleteCity = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/city/${id}`)
  } catch (error) {
    console.error(error)
    throw new Error('Xóa thành phố thất bại')
  }
}

export const updateCity = async (values: CityField) => {
  try {
    await axiosInstance.put(`/api/city/${values.id}`, values)
  } catch (error) {
    console.error(error)
    throw new Error('Cập nhật thành phố thất bại')
  }
}

export const deleteCities = async (ids: number[]) => {
  try {
    await axiosInstance.delete('/api/city/delete-multiple', { data: { ids } })
  } catch (error) {
    console.error(error)
    throw new Error('Xóa các thành phố thất bại')
  }
}