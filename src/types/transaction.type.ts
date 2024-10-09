import React from 'react'

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
  ALL = '',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum TransactionTypes {
  ALL = '',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export type TransactionFilters = {
  search?: string
  sortBy?: string
  amount?: number,
  status?: TransactionStatus,
  transactionType?: TransactionTypes,
  pageNumber?: number
  pageSize?: number
  reset?: boolean
}
