import { useSelector } from 'react-redux'
import { selectAuth } from '../features/auth/authSlice.ts'
import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  location: string
}

function ProtectedRoute({ children, location }: ProtectedRouteProps) {
  const { isAdmin } = useSelector(selectAuth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login', { state: { from: location } })
    }
  }, [isAdmin, location, navigate])

  return children
}

export default ProtectedRoute
