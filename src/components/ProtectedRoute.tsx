import { useSelector } from 'react-redux'
import { selectAuth } from '@/features/auth/authSlice.ts'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import ROUTER_NAMES from '@/constant/routerNames'

function ProtectedRoute() {
  const { isAdmin } = useSelector(selectAuth)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAdmin) {
      navigate(ROUTER_NAMES.LOGIN, { state: { from: location.pathname }, replace: true })
    }
  }, [isAdmin, navigate, location.pathname])

  return isAdmin ? <Outlet /> : null
}

export default ProtectedRoute
