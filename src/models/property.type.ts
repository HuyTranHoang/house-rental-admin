import React from 'react'

export interface Property {
  id: number
  title: string
  description: string
  location: string
  price: number
  area: number
  numRooms: number
  status: PropertyStatus
  userId: number
  userName: string
  cityId: number
  cityName: string
  districtId: number
  districtName: string
  roomTypeId: number
  roomTypeName: string
  amenities: string[]
  propertyImages: PropertyImage[]
  createdAt: string
  blocked: boolean
}

export type PropertyDataSource = Property & {
  key: React.Key
  index?: number
}

export enum PropertyStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface PropertyImage {
  imageUrl: string
  blurhash: string
}

export type PropertyFilters = {
  search?: string
  status?: PropertyStatus
  cityId?: number
  districtId?: number
  roomTypeId?: number
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  numOfDays?: number
  sortBy?: string
  pageNumber?: number
  pageSize?: number
}
