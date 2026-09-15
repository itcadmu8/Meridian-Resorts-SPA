import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute({ children, onNavigate, role = 'STAFF' }) {
	const { isAuthenticated, isLoading, user } = useAuth()

	if (isLoading) {
		return <main className="auth-state"><p>Checking your Meridian session...</p></main>
	}

	if (!isAuthenticated || (role && user?.role !== role)) {
		onNavigate(role === 'GUEST' ? '/guest/login' : '/staff/login')
		return null
	}

	return children
}