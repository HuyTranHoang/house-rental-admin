import axiosInstance from '@/axiosInstance'

export const getStatisticData = async (period: string) => {
  const params = { period }

  return await axiosInstance.get('/api/dashboard/stats', { params })
}

export const getLineChartData = async () => {
  return await axiosInstance.get('/api/dashboard/last-seven-months/all')
}

export const getBarChartData = async () => {
  return await axiosInstance.get('/api/dashboard/transaction')
}

export const countEntitiesWithPending = async () => {
  return await axiosInstance.get('/api/dashboard/pending')
}
