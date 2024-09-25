import { getAllTransactionsWithPagination, getTranasctionById } from '@/api/transaction.api'
import { TransactionFilters, TransactionStatus, TransactionTypes } from '@/models/transaction.type'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export const useTransaction = (id: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => getTranasctionById(id),
    enabled: !!id
  })

  return { transactionData: data, transactionIsLoading: isLoading }
}

export const useTransactions = (
  search: string,
  userId: number,
  amount: number,
  type: string,
  status: string,
  pageNumber: number,
  pageSize: number,
  sortBy: string
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'transactions',
      search,
      userId,
      amount,
      type,
      status,
      pageNumber,
      pageSize,
      sortBy
    ],
    queryFn: () =>
      getAllTransactionsWithPagination(
        search,
        userId,
        amount,
        type,
        status,
        pageNumber,
        pageSize,
        sortBy
      )
  })

  return { data, isLoading, isError }
}

export const useTransactionFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const userId = parseInt(searchParams.get('userId') || '0')
  const amount = parseInt(searchParams.get('amount') || '0')
  const status = (searchParams.get('status') as TransactionStatus) || ''
  const type = (searchParams.get('type') as TransactionTypes) || ''
  const sortBy = searchParams.get('sortBy') || ''
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '5')

  const setFilters = useCallback(
    (filters: TransactionFilters) => {
      setSearchParams(
        (params) => {
          if (filters.search !== undefined) {
            if (filters.search) {
              params.set('search', filters.search)
            } else {
              params.delete('search')
            }
          }

          if (filters.userId !== undefined) {
            params.set('userId', String(filters.userId))
            params.set('pageNumber', '1')
          }

          if (filters.amount !== undefined) {
            params.set('amount', String(filters.amount))
            params.set('pageNumber', '1')
          }

          if (filters.status !== undefined) {
            params.set('status', filters.status)
            params.set('pageNumber', '1')
          }

          if (filters.type !== undefined) {
            params.set('type', filters.type)
            params.set('pageNumber', '1')
          }

          if (filters.pageNumber !== undefined) {
            params.set('pageNumber', String(filters.pageNumber))
          }

          if (filters.pageSize !== undefined) {
            params.set('pageSize', String(filters.pageSize))
          }

          if (filters.sortBy !== undefined) {
            if (filters.sortBy) {
              params.set('sortBy', filters.sortBy)
            } else {
              params.delete('sortBy')
            }
          }

          return params
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  return {
    search,
    userId,
    amount,
    type,
    status,
    sortBy,
    pageNumber,
    pageSize,
    setFilters
  }
}
