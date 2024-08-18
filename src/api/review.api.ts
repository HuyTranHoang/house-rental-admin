import axios from 'axios'
import { PageInfo } from '../models/pageInfo.type'
import { Review } from '../models/review.type'
import { delay } from '../utils/delay'
import axiosInstance from '../axiosInstance'

interface ReviewWithPagination {
  pageInfo: PageInfo
  data: Review[]
}

export const getAllReviewsWithPagination = async (
  search: string,
  rating: number,
  pageNumber: number,
  pageSize: number,
  sortBy: string) => {

    try {
    pageNumber = pageNumber - 1

    const params = {
      userName: search,
      rating,
      pageNumber,
      pageSize,
      sortBy
    }

    const response = await axios.get<ReviewWithPagination>('/api/review', { params })

    await delay(300)

    if (response.status === 200) {
      // console.log(response.data)
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách đánh giá thất bại')
  }
}

export const deleteReview = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/review/${id}`)
  } catch (error) {
    console.error(error)
    throw new Error('Xóa đánh giá thất bại')
  }
}

export const deleteReviews = async (ids: number[]) => {
  try {
    await axiosInstance.delete('/api/review/delete-multiple', { data: { ids } })
  } catch (error) {
    console.error(error)
    throw new Error('Xóa các đánh giá thất bại')
  }
}