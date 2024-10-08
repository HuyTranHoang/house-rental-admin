import axiosInstance from "@/axiosInstance"
import { Advertisement, AdvertisementForm } from "@/types/advertisement.type"


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

export const updateIsActivedById = async (id: number) => {
    try {
        const response = await axiosInstance.put<Advertisement>(`/api/advertisements/active/${id}`)
        if (response.status === 200 ) {
            return response.data
        }
    } catch (error) {
        console.error(error)
        throw new Error('Kích hoạt quảng cáo thất bại')
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

export const createAdvertisement = async (values: AdvertisementForm) => {
    try {
        const response = await axiosInstance.postForm('/api/advertisements', values)
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        console.error(error)
        throw new Error('Thêm quảng cáo mới thất bại')
    }
}

export const updateAdvertisement = async (values: AdvertisementForm) => {
    try {
        const response = await axiosInstance.put(`/api/advertisements/${values.id}`, values)
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        console.error(error)
        throw new Error('Cập nhật quảng cáo thất bại')
    }
}


