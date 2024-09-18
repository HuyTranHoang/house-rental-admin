import axiosInstance from '@/axiosInstance.ts'
import { User } from '@/models/user.type.ts'
import useBoundStore from '@/store.ts'
import { useEffect, useState } from 'react'

const useRefreshToken = () => {
  const [isLoading, setIsLoading] = useState(true)

  const accessToken = localStorage.getItem('jwtToken')
  const loginSuccess = useBoundStore((state) => state.loginSuccess)

  useEffect(() => {
    const refresh = async () => {
      try {
        if (!accessToken) {
          return
        }

        setIsLoading(true)
        const response = await axiosInstance.post<User>('/api/auth/refresh-token', {}, { withCredentials: true })
        const user = response.data
        const newJwtToken = response.headers['jwt-token']

        localStorage.setItem('jwtToken', newJwtToken)
        loginSuccess(user, newJwtToken)
      } catch (error) {
        localStorage.removeItem('jwtToken')
      } finally {
        setIsLoading(false)
      }
    }

    refresh()
  }, [accessToken, loginSuccess])

  return isLoading
}

export default useRefreshToken
