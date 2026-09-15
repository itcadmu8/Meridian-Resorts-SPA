import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import ProtectedRoute from './components/auth/ProtectedRoute'
import StaffLogin from './pages/auth/StaffLogin'
import GuestLogin from './pages/guest/GuestLogin'
import MeridianGuestHome from './pages/guest/MeridianGuestHome'
import Arrivals from './pages/staff/Arrivals'
import FnbOperations from './pages/staff/FnbOperations'
import OperationsDashboard from './pages/staff/OperationsDashboard'
import SpaSchedule from './pages/staff/SpaSchedule'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MeridianGuestHome />} />
        <Route path="/guest/login" element={<GuestLogin />} />
        <Route path="/staff/login" element={<StaffLogin />} />

        <Route
          path="/staff/dashboard"
          element={(
            <ProtectedRoute role="staff" redirectTo="/staff/login">
              <OperationsDashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/staff/arrivals"
          element={(
            <ProtectedRoute role="staff" redirectTo="/staff/login">
              <Arrivals />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/staff/spa"
          element={(
            <ProtectedRoute role="staff" redirectTo="/staff/login">
              <SpaSchedule />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/staff/fnb"
          element={(
            <ProtectedRoute role="staff" redirectTo="/staff/login">
              <FnbOperations />
            </ProtectedRoute>
          )}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
