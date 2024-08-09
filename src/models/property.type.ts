export interface Property {
  id: number
  title: string
  description: string
  location: string
  price: number
  area: number
  numRooms: number
  status: string
  userId: number
  userName: string
  cityId: number
  cityName: string
  districtId: number
  districtName: string
  roomTypeId: number
  roomTypeName: string
  amenities: string[]
  propertyImages: string[]
  createdAt: string
  blocked: boolean
}
