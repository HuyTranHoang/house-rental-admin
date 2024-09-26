import React from 'react'

export interface Review {
  id: number
  rating: number
  comment: string
  propertyId: number
  propertyTitle: string
  userId: number
  userName: string
  createdAt: string
}

export type ReviewDataSource = Review & {
  key: React.Key
  index?: number
}

export type ReviewFilters = {
  search?: string
  rating?: number
  sortBy?: string
  pageNumber?: number
  pageSize?: number
}