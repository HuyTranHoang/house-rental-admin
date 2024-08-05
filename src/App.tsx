import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import Login from './features/auth/Login.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import Dashboard from './features/dashboard/Dashboard.tsx'
import { useAppDispatch } from './store.ts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { loginFailure, loginSuccess } from './features/auth/authSlice.ts'
import Spinner from './components/Spinner.tsx'
import AppLayout from './ui/AppLayout.tsx'
import City from './features/city/City.tsx'
import AddCity from './features/city/AddCity.tsx'
import UpdateCity from './features/city/UpdateCity.tsx'

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
    return <Spinner spinning={spinning} />
  }

  return (
    <BrowserRouter>
      <Toaster richColors={true} position="bottom-center" />

      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<ProtectedRoute location="/"><Dashboard /></ProtectedRoute>} />
          <Route path="/city" element={<ProtectedRoute location="/city"><City /></ProtectedRoute>} />
          <Route path="/city/add" element={<ProtectedRoute location="/city/add"><AddCity /></ProtectedRoute>} />
          <Route path="/city/:id/edit" element={<ProtectedRoute location="/city"><UpdateCity /></ProtectedRoute>} />
        </Route>

        <Route path="/login" element={<Login />} />

        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
