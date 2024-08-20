import React from 'react'

export interface District {
  id: number
  name: string
  cityId: number
  cityName: string
  createdAt: string
}

export type DistrictDataSource = District & {
  key: React.Key,
  index?: number
}

export type DistrictFilters = {
  search?: string
  cityId?: number
  sortBy?: string
  pageNumber?: number
  pageSize?: number
}