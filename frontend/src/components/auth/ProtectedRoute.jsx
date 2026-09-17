import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'

function ProtectedRoute({ children, role = null, redirectTo = '/guest/login' }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  if (role && user?.role !== role) {
    return <Navigate to={role === 'staff' ? '/staff/login' : '/guest/login'} replace />
  }

  return children
}

export default ProtectedRoute
