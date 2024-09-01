import { loginFailure, loginSuccess } from '@/features/auth/authSlice.ts'
import { User } from '@/models/user.type.ts'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import axiosInstance from '@/axiosInstance.ts'

const useRefreshToken = () => {
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const accessToken = localStorage.getItem('jwtToken')

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
        dispatch(loginSuccess({ user, token: newJwtToken }))
      } catch (error) {
        console.error('Refresh token failed:', error)
        dispatch(loginFailure())
        localStorage.removeItem('jwtToken')
      } finally {
        setIsLoading(false)
      }
    }

    refresh()
  }, [accessToken, dispatch])

  return isLoading
}

export default useRefreshToken
