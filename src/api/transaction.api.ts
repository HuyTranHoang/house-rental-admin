import { PageInfo } from '@/types/pageInfo.type.ts'
import { Transaction } from '@/types/transaction.type.ts'
import axios from 'axios'

interface TransactionsWithPagination {
  pageInfo: PageInfo
  data: Transaction[]
}

export const getAllTransactions = async () => {
  try {
    const response = await axios.get<Transaction[]>('/api/transaction/all')
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách giao dịch thất bại')
  }
}

export const getAllTransactionsWithPagination = async (
  search: string,
  transactionType: string,
  status: string,
  pageNumber: number,
  pageSize: number,
  sortBy: string
) => {
  try {
    pageNumber = pageNumber - 1

    const params = {
      search,
      transactionType,
      status,
      pageNumber,
      pageSize,
      sortBy
    }

    const response = await axios.get<TransactionsWithPagination>('/api/transaction', { params })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách giao dịch thất bại')
  }
}

export const getTranasctionById = async (id: number) => {
  try {
    const response = await axios.get<Transaction>(`/api/transaction/${id}`)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy thông tin giao dịch thất bại')
  }
}
