
export interface Advertisement {
    id: number
    name: string
    imageUrl: string
    createdAt: string
    actived: boolean
}

export interface AdvertisementForm {
    id?: number
    name: string
    description: string
    image: string
}
