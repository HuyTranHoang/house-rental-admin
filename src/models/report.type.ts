export interface Report {
  id: number
  userId: number
  username: string
  propertyId: number
  title: string
  reason: string
  status: ReportStatus
  createdAt: string
}

export enum ReportStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}