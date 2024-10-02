import axios from 'axios'
import { PageInfo } from '@/types/pageInfo.type'
import { Comment } from '@/types/comment.type.ts'
import axiosInstance from '../axiosInstance'

interface ReviewWithPagination {
  pageInfo: PageInfo
  data: Comment[]
}

export const getAllCommentWithPagination = async (
  search: string,
  pageNumber: number,
  pageSize: number,
  sortBy: string
) => {
  try {
    pageNumber = pageNumber - 1

    const params = {
      search,
      pageNumber,
      pageSize,
      sortBy
    }

    const response = await axios.get<ReviewWithPagination>('/api/comment', { params })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách bình luận thất bại')
  }
}

export const getCommentById = async (id: number) => {
  try {
    const response = await axiosInstance.get<Comment>(`/api/comment/${id}`)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy bình luận thất bại')
  }
}

export const deleteComment = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/comment/${id}`)
  } catch (error) {
    console.error(error)
    throw new Error('Xóa đánh giá thất bại')
  }
}

export const deleteComments = async (ids: number[]) => {
  try {
    await axiosInstance.delete('/api/comment/delete-multiple', { data: { ids } })
  } catch (error) {
    console.error(error)
    throw new Error('Xóa các đánh giá thất bại')
  }
}