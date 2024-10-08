import { RcFile } from 'antd/es/upload'

export interface Advertisement {
    id: number
    name: string
    imageUrl: string
    description: string
    createdAt: string
    actived: boolean
}

export interface AdvertisementForm {
    id?: number
    name: string
    description: string
    image: RcFile
}
