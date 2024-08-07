import './App.css'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAppDispatch } from './store.ts'
import { useEffect, useState } from 'react'
import { loginFailure, loginSuccess } from './features/auth/authSlice.ts'
import { Spin } from 'antd'
import router from './router.tsx'
import { delay } from './utils/delay.ts'
import axiosInstance from './axiosInstance.ts'

function App() {
  const dispatch = useAppDispatch()
  const [spinning, setSpinning] = useState(true)

  useEffect(() => {
    const refresh = async () => {
      const token = localStorage.getItem('jwtToken')
      if (token) {
        try {
          const response = await axiosInstance.get('/api/auth/refresh-token')
          const payload = {
            user: response.data,
            token: response.headers['jwt-token']
          }
          dispatch(loginSuccess(payload))
        } catch (error) {
          dispatch(loginFailure())
          localStorage.removeItem('jwtToken')
        } finally {
          await delay(500)
          setSpinning(false)
        }
      } else {
        await delay(500)
        setSpinning(false)
      }
    }

    refresh().then(() => console.log('>>>APP.JSX', 'App is mounted'))
  }, [dispatch])

  if (spinning) {
    return <Spin spinning={spinning} fullscreen />
  }



  return (
    <>
      <Toaster richColors={true} position="bottom-center" />
      <RouterProvider router={router} />
    </>
  )
}

export default App
