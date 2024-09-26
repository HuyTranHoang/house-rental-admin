export interface Transaction {
  id: number
  transactionId: string
  transactionType: string
  userId: number
  username: string
  amount: number
  transactionDate: string
  status: string
  description: string
}


export type TransactionDataSource = Transaction & {
  key: React.Key
  index?: number
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum TransactionTypes {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export type TransactionFilters = {
  search?: string
  sortBy?: string
  userId?: number,
  amount?: number,
  status?: TransactionStatus,
  transactionType?: TransactionTypes,
  pageNumber?: number
  pageSize?: number
}
