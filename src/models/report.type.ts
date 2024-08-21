import React from 'react'

export interface Report {
  id: number
  userId: number
  username: string
  propertyId: number
  title: string
  reason: string
  category: ReportCategory
  status: ReportStatus
  createdAt: string
}

export type ReportDataSource = Report & {
  key: React.Key
  index?: number
}

export enum ReportStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ReportCategory {
  SCAM = 'SCAM',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  DUPLICATE = 'DUPLICATE',
  MISINFORMATION = 'MISINFORMATION',
  OTHER = 'OTHER',
}

export type ReportFilters = {
  search?: string
  status?: ReportStatus
  category?: string
  sortBy?: string
  pageNumber?: number
  pageSize?: number
}