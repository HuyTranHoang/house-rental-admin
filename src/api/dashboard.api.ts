import axiosInstance from '@/axiosInstance'

const API_BASE_URL = '/api/dashboard'

export const getStatisticData = async (timeFrame: string) => {
  return await axiosInstance.get(`${API_BASE_URL}/${timeFrame}`)
}

export const getLineChartData = async () => {
  return await axiosInstance.get(`${API_BASE_URL}/last-seven-months`)
}

export const getBarChartData = async () => {
  return await axiosInstance.get(`${API_BASE_URL}/transaction`)
}

export const countPropertiesWithPending = () => {
  return axiosInstance.get(`${API_BASE_URL}/properties/pending`)
}
export const countCommentReportsWithPending = () => {
  return axiosInstance.get(`${API_BASE_URL}/comment-reports/pending`)
}
export const countReportsWithPending = () => {
  return axiosInstance.get(`${API_BASE_URL}/reports/pending`)
}
