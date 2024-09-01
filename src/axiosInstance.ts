import ROUTER_NAMES from '@/constant/routerNames.ts'
import axios from 'axios'
import { toast } from 'sonner'

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 403) {
      if (!originalRequest._retry) {
        originalRequest._retry = true
        try {
          const response = await axios.post('/api/auth/refresh-token', {}, { withCredentials: true })
          const newToken = response.headers['jwt-token']
          localStorage.setItem('jwtToken', newToken)
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          toast.error('Failed to refresh token')
          window.location.href = ROUTER_NAMES.LOGIN
        }
      } else {
        window.location.href = ROUTER_NAMES.LOGIN
      }
    }
  }
)

export default axiosInstance
