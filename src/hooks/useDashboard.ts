import { useState, useEffect } from 'react';
import * as dashboardApi from '@/api/dashboard.api';
import { useQuery } from '@tanstack/react-query';
import { getStatisticData } from '@/api/dashboard.api';

type ApiCall<T> = () => Promise<{ data: T }>;

export const useDashboardData = <T>(apiCall: ApiCall<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiCall();
        setData(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiCall]);

  return { data, isLoading, error };
};

export const useStatisticData = (timeFrame: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['weeklydata', timeFrame],
    queryFn: () => getStatisticData(timeFrame)
  });

  return { data, isLoading, isError }
}


export const useCountPropertiesWithPending = () => {
  return useDashboardData<number>(dashboardApi.countPropertiesWithPending);
};
export const useCountCommentReportsWithPending = () => {
  return useDashboardData<number>(dashboardApi.countCommentReportsWithPending);
};
export const useCountReportsWithPending = () => {
  return useDashboardData<number>(dashboardApi.countReportsWithPending);
};