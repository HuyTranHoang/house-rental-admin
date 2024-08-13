import axios from 'axios'
import { Property } from '@/models/property.type.ts'

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