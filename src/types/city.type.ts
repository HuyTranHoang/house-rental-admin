import React from 'react'

export interface City {
  id: number
  name: string
  createdAt: string
}

export type CityDataSource = City & {
  key: React.Key
  index?: number
}

export type CityFilters = {
  search?: string
  sortBy?: string
  pageNumber?: number
  pageSize?: number
}

export interface CityFormType {
  id?: number
  name: string
}