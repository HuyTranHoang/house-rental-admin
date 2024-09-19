import useAuthStore from '@/features/auth/authStore.ts'
import axiosInstance from '@/inteceptor/axiosInstance.ts'
import { User } from '@/models/user.type.ts'
import { delay } from '@/utils/delay.ts'
import { useEffect, useState } from 'react'

const useRefreshToken = () => {
  const [isLoading, setIsLoading] = useState(true)

  const accessToken = localStorage.getItem('jwtToken')
  const loginSuccess = useAuthStore((state) => state.loginSuccess)

  useEffect(() => {
    const refresh = async () => {
      try {
        if (!accessToken) {
          console.log('No access token')
          await delay(500)
          setIsLoading(false)
          return
        }

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
