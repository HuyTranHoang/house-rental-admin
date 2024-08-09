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