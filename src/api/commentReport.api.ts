import axiosInstance from '@/axiosInstance.ts'
import { CommentReport, CommentReportStatus } from '@/types/commentReport.type.ts'
import { PageInfo } from '@/types/pageInfo.type.ts'

interface CommentReportsWithPagination {
  pageInfo: PageInfo
  data: CommentReport[]
}

export interface updateCommentReportStatus {
  id: number
  status: CommentReportStatus
}

export const getAllCommentReportsWithPagination = async (
  search: string,
  category: string,
  status: CommentReportStatus,
  pageNumber: number,
  pageSize: number,
  sortBy: string
) => {
  try {
    pageNumber = pageNumber - 1

    const params = {
      username: search,
      category,
      status,
      pageNumber,
      pageSize,
      sortBy
    }

    const response = await axiosInstance.get<CommentReportsWithPagination>('/api/comment-reports', { params })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách báo cáo bình luận thất bại')
  }
}

export const updateCommentReportStatus = async ({ id, status }: updateCommentReportStatus) => {
  try {
    const params = {
      status
    }
    await axiosInstance.put(`/api/comment-reports/${id}`, {}, { params })
  } catch (error) {
    console.error(error)
    throw new Error('Cập nhật trạng thái báo cáo bình luận thất bại')
  }
}
