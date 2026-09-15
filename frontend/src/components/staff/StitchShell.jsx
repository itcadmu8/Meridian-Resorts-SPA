import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/staff/dashboard', label: 'Dashboard' },
  { to: '/staff/arrivals', label: 'Arrivals' },
  { to: '/staff/spa', label: 'Spa Bookings' },
  { to: '/staff/fnb', label: "Today's F&B Covers" },
]

function StitchShell({
  breadcrumb,
  title,
  subtitle,
  roleInitials = 'OM',
  roleLabel = 'Operations Manager',
  onRefresh,
  refreshLabel = 'Refresh Data',
  refreshing = false,
  children,
}) {
  return (
    <div className="stitch-shell">
      <aside className="stitch-sidebar">
        <div>
          <div className="stitch-brand">
            <span className="stitch-brand-mark">≈</span>
            <div><strong>MERIDIAN</strong><small>RESORTS &amp; SPA</small></div>
          </div>
          <nav className="stitch-nav" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="stitch-sidebar-status"><span className="status-dot" /> Ops Network Active <code>v2.4.8</code></div>
      </aside>

      <main className="stitch-main">
        <header className="stitch-hero">
          <div>
            <h1>Good Morning, Operations Team</h1>
            <p>Here&apos;s what&apos;s happening across our resorts today.</p>
          </div>
          <div className="stitch-user"><span>{roleInitials}</span><strong>{roleLabel}</strong></div>
        </header>
        <div className="stitch-content">
          <div className="stitch-breadcrumb">{breadcrumb}</div>
          <div className="stitch-title-row">
            <div>
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>
            {onRefresh ? (
              <button type="button" className="stitch-refresh" onClick={onRefresh} disabled={refreshing}>
                {refreshLabel}
              </button>
            ) : null}
          </div>

          {children}
        </div>
      </main>
    </div>
  )
}

export default StitchShell
