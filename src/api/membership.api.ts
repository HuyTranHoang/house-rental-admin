
import { PageInfo } from '@/types/pageInfo.type.ts'
import axiosInstance from '@/axiosInstance.ts'
import { MemberShip, MemberShipForm } from '@/types/membership.type'

export interface MemberShipWithPagination {
  pageInfo: PageInfo
  data: MemberShip[]
}

export const getAllMemberShip = async () => {
  try {
    const response = await axiosInstance.get<MemberShip[]>('/api/membership/all')
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách gói thành viên thất bại')
  }
}

export const getAllMemberShipsWithPagination = async (
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

    const response = await axiosInstance.get<MemberShipWithPagination>('/api/membership', { params })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách gói thành viên thất bại')
  }
}

export const getMemberShipById = async (id: number) => {
  try {
    const response = await axiosInstance.get<MemberShip>(`/api/membership/${id}`)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy thông tin gói thành viên thất bại')
  }
}

export const addMemberShip = async (values: MemberShipForm) => {
  await axiosInstance.post('/api/membership', values)
}

export const deleteMemberShip = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/membership/${id}`)
  } catch (error) {
    console.error(error)
    throw new Error('Xóa gói thành viên thất bại')
  }
}

export const updateMembership = async (values: MemberShipForm) => {
  await axiosInstance.put(`/api/membership/${values.id}`, values)
}

export const deleteMemberships = async (ids: number[]) => {
  try {
    await axiosInstance.delete('/api/membership/delete-multiple', { data: { ids } })
  } catch (error) {
    console.error(error)
    throw new Error('Xóa các gói thành viên thất bại')
  }
}
