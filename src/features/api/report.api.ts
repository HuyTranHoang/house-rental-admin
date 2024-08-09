import { PageInfo } from '../../models/pageInfo.type.ts'
import { Report, ReportStatus } from '../../models/report.type.ts'
import axiosInstance from '../../axiosInstance.ts'

interface ReportsWithPagination {
  pageInfo: PageInfo
  data: Report[]
}

export interface updateReportStatus {
  id: number
  status: ReportStatus
}


export const getAllReportsWithPagination = async (search: string,
                                                  category: string,
                                                  status: ReportStatus,
                                                  pageNumber: number,
                                                  pageSize: number,
                                                  sortBy: string) => {
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

    const response = await axiosInstance.get<ReportsWithPagination>('/api/reports', { params })

    //await delay(300) // Giả delay 300ms để thấy rõ sự chuyển động của loading

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw new Error('Lấy danh sách báo cáo thất bại')
  }
}

export const updateReportStatus = async ({ id, status }: updateReportStatus) => {
  try {
    const params = {
      status
    }
    await axiosInstance.put(`/api/reports/${id}`, {}, { params })
  } catch (error) {
    console.error(error)
    throw new Error('Cập nhật trạng thái báo cáo thất bại')
  }
}