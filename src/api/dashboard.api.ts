import axiosInstance from '@/axiosInstance';


const API_BASE_URL = '/api/dashboard';

export const getUsersCreatedThisWeek = () => {
  return axiosInstance.get(`${API_BASE_URL}/users/week`);
};

export const getUsersCreatedThisMonth = () => {
  return axiosInstance.get(`${API_BASE_URL}/users/month`);
};

export const getTotalUsers = () => {
  return axiosInstance.get(`${API_BASE_URL}/users/total`);
};

export const getTotalDepositAmountThisWeek = () => {
  return axiosInstance.get(`${API_BASE_URL}/deposit/week`);
};

export const getTotalDepositAmountForCurrentMonth = () => {
  return axiosInstance.get(`${API_BASE_URL}/deposit/month`);
};

export const getTotalDepositAmount = () => {
  return axiosInstance.get(`${API_BASE_URL}/deposit/total`);
};

export const getTotalWithdrawalAmountThisWeek = () => {
  return axiosInstance.get(`${API_BASE_URL}/withdrawal/week`);
};

export const getTotalWithdrawalAmountForCurrentMonth = () => {
  return axiosInstance.get(`${API_BASE_URL}/withdrawal/month`);
};

export const getTotalWithdrawalAmount = () => {
  return axiosInstance.get(`${API_BASE_URL}/withdrawal/total`);
};

export const countPropertiesCreatedThisWeek = () => {
  return axiosInstance.get(`${API_BASE_URL}/properties/week`);
};

export const countPropertiesCreatedThisMonth = () => {
  return axiosInstance.get(`${API_BASE_URL}/properties/month`);
};

export const countTotalProperties = () => {
  return axiosInstance.get(`${API_BASE_URL}/properties/total`);
};

export const countCommentsCreatedThisWeek = () => {
  return axiosInstance.get(`${API_BASE_URL}/comments/week`);
};

export const countCommentsCreatedThisMonth = () => {
  return axiosInstance.get(`${API_BASE_URL}/comments/month`);
};

export const countTotalComments = () => {
  return axiosInstance.get(`${API_BASE_URL}/comments/total`);
};
