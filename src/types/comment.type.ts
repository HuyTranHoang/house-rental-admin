import React from 'react'

export interface Comment {
  id: number
  comment: string
  propertyId: number
  propertyTitle: string
  userId: number
  userName: string
  createdAt: string
  blocked: boolean
}

export type CommentDataSource = Comment & {
  key: React.Key
  index?: number
}

export type CommentFilters = {
  search?: string
  sortBy?: string
  pageNumber?: number
  pageSize?: number
}