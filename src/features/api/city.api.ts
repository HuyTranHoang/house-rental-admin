import axios from 'axios'
import { CityType } from '../../models/city.type.ts'
import { PageInfo } from '../../models/pageInfo.type.ts'

export type AddCityField = {
  name: string;
};

export type UpdateCityField = {
  id: number;
  name: string;
};

interface CitiesWithPagination {
  pageInfo: PageInfo
  data: CityType[]
}

export const getAllCities = async () => {
  try {
    const response = await axios.get<CityType[]>('/api/city/all')
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
  }
}

export const getAllCitiesWithPagination = async (search: string, pageNumber: number, pageSize: number) => {
  try {
    pageNumber = pageNumber - 1

    const params = {
      name: search,
      pageNumber,
      pageSize
    }

    const response = await axios.get<CitiesWithPagination>('/api/city', { params })
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
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
  }
}

export const addCity = async (values: AddCityField) => {
  try {
    await axios.post('/api/city', values, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export const deleteCity = async (id: number) => {
  try {
    await axios.delete(`/api/city/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export const updateCity = async (values: UpdateCityField) => {
  try {
    await axios.put(`/api/city/${values.id}`, values, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
  } catch (error) {
    console.error(error)
  }
}