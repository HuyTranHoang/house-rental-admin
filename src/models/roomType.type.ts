import React from 'react'

export interface RoomType {
  id: number
  name: string
  createdAt: string
}

export type RoomTypeDataSource = RoomType & {
  key: React.Key,
  index?: number
}