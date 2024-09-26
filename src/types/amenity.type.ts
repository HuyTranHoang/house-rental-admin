import React from 'react'

export interface Amenity {
  id: number
  name: string
  createdAt: string
}

export type AmenityDataSource = Amenity & {
  key: React.Key
  index?: number
}

export interface AmenityForm {
  id?: number
  name: string
}