import axiosInstance from '@/axiosInstance';


const API_BASE_URL = '/api/dashboard';

export const getStatisticData = (timeFrame: string) => {
  return axiosInstance.get(`${API_BASE_URL}/${timeFrame}`);
};



export const countPropertiesWithPending = () => {
  return axiosInstance.get(`${API_BASE_URL}/properties/pending`);
};
export const countCommentReportsWithPending = () => {
  return axiosInstance.get(`${API_BASE_URL}/comment-reports/pending`);
};
export const countReportsWithPending = () => {
  return axiosInstance.get(`${API_BASE_URL}/reports/pending`);
};
