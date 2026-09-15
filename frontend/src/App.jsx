import { useEffect, useState } from 'react'

import { AuthProvider } from './hooks/useAuth'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import MeridianGuestHome from './pages/guest/MeridianGuestHome'
import GuestLogin from './pages/guest/GuestLogin'
import StaffLogin from './pages/auth/StaffLogin'
import OperationsDashboard from './pages/staff/OperationsDashboard'

function StaffPlaceholder({ onNavigate, title }) {
  return (
    <main className="staff-placeholder">
      <button type="button" onClick={() => onNavigate('/staff/dashboard')}>Back to dashboard</button>
      <h1>{title}</h1>
      <p>This operational view is reserved for its story owner.</p>
    </main>
  )
}

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/')

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname || '/')
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(path) {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    window.scrollTo(0, 0)
  }

  function protectedPage(Page) {
    return (
      <ProtectedRoute onNavigate={navigate}>
        <Page onNavigate={navigate} />
      </ProtectedRoute>
    )
  }

  let content
  switch (currentPath) {
    case '/guest/login':
      content = <GuestLogin onNavigate={navigate} />
      break
    case '/staff/login':
      content = <StaffLogin onNavigate={navigate} />
      break
    case '/staff/dashboard':
      content = protectedPage(OperationsDashboard)
      break
    case '/staff/arrivals':
      content = protectedPage((props) => <StaffPlaceholder {...props} title="Arrivals" />)
      break
    case '/staff/spa':
      content = protectedPage((props) => <StaffPlaceholder {...props} title="Spa schedule" />)
      break
    case '/staff/fnb':
      content = protectedPage((props) => <StaffPlaceholder {...props} title="F&B operations" />)
      break
    case '/':
    default:
      content = <MeridianGuestHome onNavigate={navigate} />
  }

  return <AuthProvider>{content}</AuthProvider>
}

export default App
