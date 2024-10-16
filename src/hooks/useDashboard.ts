import * as dashboardApi from '@/api/dashboard.api'
import { getBarChartData, getLineChartData, getStatisticData } from '@/api/dashboard.api'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

type ApiCall<T> = () => Promise<{ data: T }>

export const useDashboardData = <T>(apiCall: ApiCall<T>) => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await apiCall()
        setData(response.data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [apiCall])

  return { data, isLoading, error }
}

export const useStatisticData = (period: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['weeklydata', period],
    queryFn: () => getStatisticData(period)
  })

  return { data, isLoading, isError }
}

export const useLineChartData = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['lineChartData'],
    queryFn: getLineChartData
  })

  return { data, isLoading, isError }
}

export const useBarChartData = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['barChartData'],
    queryFn: getBarChartData
  })

  return { data, isLoading, isError }
}

export const usePendingData = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['pendingData'],
    queryFn: dashboardApi.countEntitiesWithPending
  })

  return { data, isLoading, isError }
}
