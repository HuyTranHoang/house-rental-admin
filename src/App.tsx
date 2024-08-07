import './App.css'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAppDispatch } from './store.ts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { loginFailure, loginSuccess } from './features/auth/authSlice.ts'
import { Spin } from 'antd'
import router from './router.tsx'

function App() {
  const dispatch = useAppDispatch()
  const [spinning, setSpinning] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    if (token) {
      axios.get('/api/auth/refresh-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        console.log('>>>APP.JSX', response)
        const payload = {
          user: response.data,
          token: response.headers['jwt-token']
        }
        dispatch(loginSuccess(payload))
      }).catch(error => {
        console.log('>>>APP.JSX', error)
        dispatch(loginFailure(error))
        localStorage.removeItem('jwtToken')
      }).finally(() => {
        setTimeout(() => {
          setSpinning(false)
        }, 500)
      })
    } else {
      setTimeout(() => {
        setSpinning(false)
      }, 500)
    }

    console.log('>>>APP.JSX', 'App is mounted')
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
