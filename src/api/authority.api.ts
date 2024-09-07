import axiosInstance from '@/axiosInstance.ts'
import { Authority } from '@/models/authority.type.ts'

export const getAllAuthorities = async () => {
  try {
    const response = await axiosInstance.get<Authority[]>('/api/authorities/all')
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách quyền hạn thất bại')
  }
}