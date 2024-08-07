import { useSelector } from 'react-redux'
import { selectAuth } from '../features/auth/authSlice.ts'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useEffect } from 'react'


function ProtectedRoute() {
  const { isAdmin } = useSelector(selectAuth)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login', { state: { from: location.pathname } })
    }
  }, [isAdmin, navigate, location.pathname])

  return isAdmin ? <Outlet /> : null
}

export default ProtectedRoute