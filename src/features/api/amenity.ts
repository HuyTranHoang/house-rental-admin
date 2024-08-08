import axios from 'axios'
import { Amenity } from '../../models/amenity'
import { PageInfo } from '../../models/pageInfo.type'
import { delay } from '../../utils/delay'

export interface AmenityFeild {
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
