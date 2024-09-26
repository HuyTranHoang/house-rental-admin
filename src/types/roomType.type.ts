import React from 'react'

export interface RoomType {
  id: number
  name: string
  createdAt: string
}

export type RoomTypeDataSource = RoomType & {
  key: React.Key
  index?: number
}

export type RoomTypeFilters = {
  search?: string
  sortBy?: string
  pageNumber?: number
  pageSize?: number
}

export interface RoomTypeForm {
  id?: number
  name: string
}