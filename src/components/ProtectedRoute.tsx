import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import ROUTER_NAMES from '@/constant/routerNames'
import useBoundStore from '@/store.ts'

function ProtectedRoute() {
  const isAdmin = useBoundStore((state) => state.isAdmin)
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
