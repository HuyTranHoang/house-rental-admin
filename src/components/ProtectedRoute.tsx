import ROUTER_NAMES from '@/constant/routerNames'
import useBoundStore from '@/store.ts'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

function ProtectedRoute() {
  const isAdmin = useBoundStore((state) => state.isAdmin)
  const haveDashboardAccess = useBoundStore((state) => state.haveDashboardAccess)
  const navigate = useNavigate()
  const location = useLocation()

  const canAccess = isAdmin || haveDashboardAccess

  useEffect(() => {
    if (!canAccess) {
      navigate(ROUTER_NAMES.LOGIN, { state: { from: location.pathname }, replace: true })
    }
  }, [navigate, location.pathname, canAccess])

  return canAccess ? <Outlet /> : null
}

export default ProtectedRoute
