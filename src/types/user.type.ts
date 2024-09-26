import React from 'react'

export interface User {
  id: number
  username: string
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  avatarUrl: string
  balance: number
  roles: string[]
  authorities: string[]
  active: boolean
  nonLocked: boolean
  createdAt: string
}

export type UserDataSource = User & {
  key: React.Key
  index?: number
}

export type UserFilters = {
  search?: string
  isNonLocked?: boolean
  roles?: string
  sortBy?: string
  pageNumber?: number
  pageSize?: number
}