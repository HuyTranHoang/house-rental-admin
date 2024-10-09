import { getAllTransactionsWithPagination, getTranasctionById } from '@/api/transaction.api'
import { TransactionFilters, TransactionStatus, TransactionTypes } from '@/types/transaction.type'
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
  transactionType: string,
  status: string,
  pageNumber: number,
  pageSize: number,
  sortBy: string
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['transactions', search, transactionType, status, pageNumber, pageSize, sortBy],
    queryFn: () => getAllTransactionsWithPagination(search, transactionType, status, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useTransactionFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const status = (searchParams.get('status') as TransactionStatus) || undefined
  const transactionType = (searchParams.get('transactionType') as TransactionTypes) || undefined
  const sortBy = searchParams.get('sortBy') || ''
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '5')

  const setFilters = useCallback(
    (filters: TransactionFilters) => {
      setSearchParams(
        (params) => {
          if (filters.reset) {
            params.delete('search')
            params.delete('status')
            params.delete('transactionType')
            params.delete('pageNumber')
            params.delete('pageSize')
            params.delete('sortBy')
            params.set('pageNumber', '1')
            params.set('pageSize', '5')
            return params
          }

          if (filters.search !== undefined) {
            if (filters.search) {
              params.set('search', filters.search)
            } else {
              params.delete('search')
            }
          }

          if (filters.status !== undefined) {
            params.set('status', String(filters.status))
            params.set('pageNumber', '1')
          }

          if (filters.transactionType !== undefined) {
            params.set('transactionType', String(filters.transactionType))
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
    status,
    transactionType,
    sortBy,
    pageNumber,
    pageSize,
    setFilters
  }
}
