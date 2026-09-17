import { NavLink } from 'react-router-dom'

function StaffNav() {
  return (
    <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }} aria-label="Staff navigation">
      <NavLink to="/staff/dashboard" style={linkStyle}>Dashboard</NavLink>
      <NavLink to="/staff/arrivals" style={linkStyle}>Today&apos;s Arrivals</NavLink>
      <NavLink to="/staff/spa" style={linkStyle}>Spa Schedule</NavLink>
      <NavLink to="/staff/fnb" style={linkStyle}>F&amp;B Covers</NavLink>
    </nav>
  )
}

function linkStyle({ isActive }) {
  return {
    padding: '8px 12px',
    border: '1px solid #d9ddd1',
    borderRadius: '999px',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: 700,
    color: isActive ? '#fffaf1' : '#17352f',
    background: isActive ? '#17352f' : '#fffdf7',
  }
}

export default StaffNav
