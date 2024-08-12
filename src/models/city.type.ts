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