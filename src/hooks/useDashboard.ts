import { useState, useEffect } from 'react';
import * as dashboardApi from '@/api/dashboard.api';

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


export const useUsersCreatedThisWeek = () => {
  return useDashboardData<number>(dashboardApi.getUsersCreatedThisWeek);
};
export const useUsersCreatedThisMonth = () => {
  return useDashboardData<number>(dashboardApi.getUsersCreatedThisMonth);
};
export const useTotalUsers = () => {
  return useDashboardData<number>(dashboardApi.getTotalUsers);
};

export const useTotalDepositAmountThisWeek = () => {
  return useDashboardData<number>(dashboardApi.getTotalDepositAmountThisWeek);
};
export const useTotalDepositAmountForCurrentMonth = () => {
  return useDashboardData<number>(dashboardApi.getTotalDepositAmountForCurrentMonth);
};
export const useTotalDepositAmount = () => {
  return useDashboardData<number>(dashboardApi.getTotalDepositAmount);
};


export const useTotalWithdrawalAmountThisWeek = () => {
  return useDashboardData<number>(dashboardApi.getTotalWithdrawalAmountThisWeek);
};
export const useTotalWithdrawalAmountForCurrentMonth = () => {
  return useDashboardData<number>(dashboardApi.getTotalWithdrawalAmountForCurrentMonth);
};
export const useTotalWithdrawalAmount = () => {
  return useDashboardData<number>(dashboardApi.getTotalWithdrawalAmount);
};

export const useCountPropertiesCreatedThisWeek = () => {
  return useDashboardData<number>(dashboardApi.countPropertiesCreatedThisWeek);
};
export const useCountPropertiesCreatedThisMonth = () => {
  return useDashboardData<number>(dashboardApi.countPropertiesCreatedThisMonth);
};
export const useCountTotalProperties = () => {
  return useDashboardData<number>(dashboardApi.countTotalProperties);
};

export const useCountCommentsCreatedThisWeek = () => {
  return useDashboardData<number>(dashboardApi.countCommentsCreatedThisWeek);
};
export const useCountCommentsCreatedThisMonth = () => {
  return useDashboardData<number>(dashboardApi.countCommentsCreatedThisMonth);
};
export const useCountTotalComments = () => {
  return useDashboardData<number>(dashboardApi.countTotalComments);
};