import { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute({ children, onNavigate, role = 'STAFF' }) {
	const { isAuthenticated, isLoading, user } = useAuth()

	const redirectPath = role === 'GUEST' ? '/guest/login' : '/staff/login'

	useEffect(() => {
		if (!isLoading && (!isAuthenticated || (role && user?.role !== role))) onNavigate(redirectPath)
	}, [isAuthenticated, isLoading, onNavigate, redirectPath, role, user?.role])

	if (isLoading) {
		return <main className="auth-state"><p>Checking your Meridian session...</p></main>
	}

	if (!isAuthenticated || (role && user?.role !== role)) return null

	return children
}