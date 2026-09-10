import { useState } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import Reservations from './pages/Reservations.jsx'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('arrivals')

  return (
    <>
      {activeView === 'dashboard' ? (
        <Dashboard onNavigate={setActiveView} />
      ) : (
        <Reservations onBack={() => setActiveView('dashboard')} />
      )}
    </>
  )
}

export default App
