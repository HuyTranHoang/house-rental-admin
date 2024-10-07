import axiosInstance from "@/axiosInstance"
import { Advertisement } from "@/types/advertisement.type"


export const getAllAdvertisements = async () => {
    try {
        const response = await axiosInstance.get<Advertisement[]>('/api/advertisements')
        if (response.status === 200 ) {
            return response.data
        }
    } catch (error) {
        console.error(error)
        throw new Error('Lấy danh sách quảng cáo thất bại')
    }
}

export const getAdvertisementById = async (id: number) => {
    try {
        const response = await axiosInstance.get<Advertisement>(`/api/advertisements/${id}`)
        if (response.status === 200 ) {
            return response.data
        }
    } catch (error) {
        console.error(error)
        throw new Error('Lấy thông tin quảng cáo thất bại')
    }
}

export const deleteAdvertisement = async (id: number) => {
    try {
        await axiosInstance.delete<Advertisement>(`/api/advertisements/${id}`)
    } catch (error) {
        console.error(error)
        throw new Error('Xoá quảng cáo thất bại')
    }
}