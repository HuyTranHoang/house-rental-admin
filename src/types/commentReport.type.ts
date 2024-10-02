export interface CommentReport {
  id: number
  userId: number
  username: string
  commentId: number
  comment: string
  reason: string
  category: ReportCategory
  status: CommentReportStatus
  createdAt: string
}

export type CommentReportDataSource = CommentReport & {
  key: React.Key
  index?: number
}

export enum CommentReportStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum CommentReportCategory {
  SCAM = 'SCAM',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  DUPLICATE = 'DUPLICATE',
  MISINFORMATION = 'MISINFORMATION',
  OTHER = 'OTHER'
}

export type CommentReportFilters = {
  search?: string
  status?: CommentReportStatus
  category?: ReportCategory
  sortBy?: string
  pageNumber?: number
  pageSize?: number
}
