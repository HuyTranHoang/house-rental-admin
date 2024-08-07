import axios from 'axios'
import { PageInfo } from '../../models/pageInfo.type.ts'
import { RoomType } from '../../models/roomType.type.ts'
import { delay } from '../../utils/delay.ts'
import axiosInstance from '../../axiosInstance.ts'


interface RoomTypesWithPagination {
  pageInfo: PageInfo
  data: RoomType[]
}

export const getAllRoomTypesWithPagination = async (search: string, pageNumber: number, pageSize: number, sortBy: string) => {
  try {
    pageNumber = pageNumber - 1

    const params = {
      name: search,
      pageNumber,
      pageSize,
      sortBy
    }

    const response = await axios.get<RoomTypesWithPagination>('/api/room-type', { params })

    await delay(300) // Giả delay 300ms để thấy rõ sự chuyển động của loading

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách loại phòng thất bại')
  }
}

export const deleteRoomType = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/room-type/${id}`)
  } catch (error) {
    console.error(error)
    throw new Error('Xóa loại phòng thất bại')
  }
}

export const deleteRoomTypes = async (ids: number[]) => {
  try {
    await axiosInstance.delete('/api/room-type/delete-multiple', { data: { ids } })
  } catch (error) {
    console.error(error)
    throw new Error('Xóa các lọai phòng thất bại')
  }
}