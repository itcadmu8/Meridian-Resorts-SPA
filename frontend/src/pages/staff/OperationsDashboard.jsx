import { useEffect, useMemo, useState } from 'react'

import { useOperationsDashboard } from '../../hooks/useOperationsDashboard'

const demoProperties = [
  { name: 'Meridian Beach Resort', short: 'M. Beach', arrivals: 6, spa: 5, fnb: 85 },
  { name: 'Meridian Lake Resort', short: 'M. Lake', arrivals: 4, spa: 4, fnb: 72 },
  { name: 'Meridian Mountain Resort', short: 'M. Mountain', arrivals: 4, spa: 3, fnb: 64 },
  { name: 'Meridian City Resort', short: 'M. City', arrivals: 2, spa: 2, fnb: 58 },
  { name: 'Meridian Desert Resort', short: 'M. Desert', arrivals: 5, spa: 3, fnb: 76 },
  { name: 'Meridian Forest Resort', short: 'M. Forest', arrivals: 3, spa: 1, fnb: 65 },
]

const healthProperties = ['Beach', 'Lake', 'Mountain', 'City', 'Desert', 'Forest']

function DashboardIcon({ type }) {
  const paths = {
    dashboard: 'M3 9.5L12 3l9 6.5V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20V9.5zM9 21.5v-6a3 3 0 0 1 6 0v6',
    arrivals: 'M5 3v5a2.5 2.5 0 0 0 5 0V3M7.5 3v18M16 3v8a2 2 0 0 0 2 2h.5v8M18.5 3c-1.5 3-2.5 5.5-2.5 8',
    spa: 'M12 4c-1.5 3-3 6.5-3 10a3 3 0 0 0 6 0c0-3.5-1.5-7-3-10zM9.5 14C7 11 3.5 11 3 14c-.5 3 3 5 8.5 5M14.5 14C17 11 20.5 11 21 14c.5 3-3 5-8.5 5',
    fnb: 'M5 3v5a2.5 2.5 0 0 0 5 0V3M7.5 3v18M16 3v18M16 3c3 4 3 7 0 10',
  }
  return <svg className="ops-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[type] || paths.dashboard} /></svg>
}

function OperationsDashboard({ onNavigate }) {
  const { dashboard, error, isLoading, refresh } = useOperationsDashboard({ date: new Date().toISOString().slice(0, 10) })
  const [viewState, setViewState] = useState('normal')
  const [activeSeries, setActiveSeries] = useState(null)
  const [partialHealth, setPartialHealth] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [barsReady, setBarsReady] = useState(false)
  const properties = useMemo(() => dashboard?.properties?.length ? dashboard.properties.map((item) => ({
    name: item.property_name,
    short: item.property_name?.replace('Meridian ', 'M. '),
    arrivals: Number(item.arrivals) || 0,
    spa: Number(item.spa_bookings) || 0,
    fnb: Number(item.fnb_covers) || 0,
  })) : demoProperties, [dashboard])

  useEffect(() => {
    const timer = window.setTimeout(() => setBarsReady(true), 120)
    return () => window.clearTimeout(timer)
  }, [viewState])

  const totals = properties.reduce((result, property) => ({
    arrivals: result.arrivals + property.arrivals,
    spa: result.spa + property.spa,
    fnb: result.fnb + property.fnb,
  }), { arrivals: 0, spa: 0, fnb: 0 })
  const currentState = viewState === 'normal' && error ? 'error' : viewState

  function handleRefresh() {
    setBarsReady(false)
    setViewState('normal')
    refresh()
  }

  return <div className="ops-workspace">
    <header className="ops-sandbox-bar">
      <div className="sandbox-label"><span className="live-pulse" /> <strong>SANDBOX VIEWPORT</strong><span>|</span><span>Toggle operational response view:</span></div>
      <div className="state-switcher">{[['normal', 'Normal / Live'], ['loading', 'Loading Skeleton'], ['error', 'Error State'], ['empty', 'Empty State']].map(([value, label]) => <button key={value} type="button" className={viewState === value ? 'active' : ''} onClick={() => setViewState(value)}>{label}</button>)}</div>
    </header>

    <div className="ops-layout">
      <aside className="ops-sidebar">
        <button className="ops-brand" type="button" onClick={() => onNavigate('/')}><span className="brand-seal">M</span><span><strong>MERIDIAN</strong><small>RESORTS &amp; SPA</small></span></button>
        <nav aria-label="Operations navigation">
          <button className="selected" type="button"><DashboardIcon type="dashboard" />Dashboard</button>
          <button type="button" onClick={() => onNavigate('/staff/fnb')}><DashboardIcon type="fnb" />Today&rsquo;s F&amp;B Covers</button>
          <button type="button" onClick={() => onNavigate('/staff/arrivals')}><DashboardIcon type="arrivals" />Arrivals</button>
          <button type="button" onClick={() => onNavigate('/staff/spa')}><DashboardIcon type="spa" />Spa Bookings</button>
          <button type="button" onClick={() => onNavigate('/')}><DashboardIcon type="dashboard" />Guest Portal</button>
          <button type="button" onClick={() => onNavigate('/staff/fnb')}><DashboardIcon type="dashboard" />Reconciliation</button>
        </nav>
        <p className="sidebar-note">Member 4: Cross-Property Aggregation Contract</p>
      </aside>

      <div className="ops-main">
        <section className="ops-hero">
          <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80" alt="Meridian tropical resort" />
          <div className="hero-shade" />
          <div className="hero-content"><span className="hero-tag">CROSS-PROPERTY OVERVIEW</span><h1>Good Morning, Operations Team</h1><p>Here&rsquo;s what&rsquo;s happening across our resorts today.</p></div>
          <div className="hero-actions"><span className="date-chip">▣ &nbsp; {new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(new Date())}</span><div className="profile-wrap"><button className="profile-chip" type="button" onClick={() => setProfileOpen((open) => !open)}><span>OM</span> Operations Manager⌄</button>{profileOpen && <div className="profile-menu"><strong>Operations Manager</strong><small>operations@meridian.internal</small><button type="button" onClick={() => onNavigate('/')}>Guest Home</button><button type="button" onClick={() => onNavigate('/staff/login')}>Sign Out</button></div>}</div></div>
        </section>

        <main className="ops-content">
          <section className="ops-page-heading"><div><p>Dashboard &nbsp;&gt;&nbsp; <strong>Overview</strong></p><h2>Operations Dashboard</h2><span>A consolidated view of today&rsquo;s operations across all Meridian properties.</span></div><div className="heading-actions"><span>Last updated: <b>09:15 AM</b> <i className="live-pulse" /></span><button className="refresh-button" type="button" onClick={handleRefresh} disabled={isLoading}>↻ &nbsp;{isLoading ? 'Syncing...' : 'Refresh Data'}</button></div></section>

          {currentState === 'loading' && <div className="dashboard-skeleton"><div className="skeleton-row"><span /><span /><span /></div><div className="skeleton-chart" /><div className="skeleton-row"><span /><span /><span /></div></div>}
          {currentState === 'error' && <section className="dashboard-state error-state"><strong>!</strong><h3>Operational Aggregation Error</h3><p>Unable to aggregate operational metrics across properties. The cross-resort synchronization service did not respond.</p><button type="button" onClick={handleRefresh}>↻ &nbsp; Retry Connection</button></section>}
          {currentState === 'empty' && <section className="dashboard-state"><strong>□</strong><h3>No Operational Data Available</h3><p>No resort operations have been logged or synced for today. Once daily property operations commence, records will appear here.</p><button type="button" onClick={() => setViewState('normal')}>Reset to Live Dashboard</button></section>}
          {currentState === 'normal' && <div className="dashboard-live">
            <section className="kpi-grid">{[['TODAY\'S ARRIVALS', totals.arrivals, 'Across all 6 properties', '+8% vs. yesterday'], ['SPA BOOKINGS', totals.spa, 'Across all 6 properties', '82% utilization'], ['F&B COVERS', totals.fnb || 420, 'Across all 6 properties', '+12% vs. yesterday']].map(([label, value, caption, trend], index) => <article className="kpi-card" key={label}><div><span>{label}</span><strong>{value}</strong></div><b className={`kpi-icon kpi-${index}`}>{index === 0 ? '▣' : index === 1 ? '◌' : '+'}</b><footer><small>{caption}</small><em>{trend}</em></footer></article>)}</section>

            <section className="chart-card"><header><div><h3><i />Operations by Property</h3><p>Comparative operational breakdown across all 6 resorts for Arrivals, Spa, and F&amp;B Covers</p></div><div className="chart-legend">{[['arrivals', 'Arrivals', '#176b63'], ['spa', 'Spa Bookings', '#3fb8b0'], ['fnb', 'F&B Covers (/10)', '#0e4d48']].map(([key, label, color]) => <button type="button" key={key} className={activeSeries === key ? 'active' : ''} onMouseEnter={() => setActiveSeries(key)} onMouseLeave={() => setActiveSeries(null)}><i style={{ backgroundColor: color }} />{label}</button>)}</div></header><div className="bar-chart"><div className="chart-grid"><span>10</span><span>7.5</span><span>5</span><span>2.5</span><span>0</span></div><div className="bar-groups">{properties.map((property) => <div className="bar-group" key={property.name}><div className="bars">{[['arrivals', property.arrivals, '#176b63'], ['spa', property.spa, '#3fb8b0'], ['fnb', Math.round(property.fnb / 10), '#0e4d48']].map(([key, value, color]) => <span key={key} title={`${property.name}: ${value}`} className={activeSeries && activeSeries !== key ? 'dimmed' : ''} style={{ height: barsReady ? `${Math.min(100, value * 10)}%` : '0%', backgroundColor: color }} />)}</div><small>{property.short}</small></div>)}</div></div><p className="chart-note">* F&amp;B covers normalized at 1:10 scale for consolidated visual tracking</p></section>

            <section className="shortcut-grid">{[['arrivals', 'Today\'s Arrivals', `${totals.arrivals} Expected Arrivals`, 'Smooth Check-ins', '/staff/arrivals'], ['spa', 'Spa Bookings', `${totals.spa} Scheduled Treatments`, 'High Demand (82%)', '/staff/spa'], ['fnb', 'F&B Covers', `${totals.fnb || 420} Confirmed Covers`, '+12% Pace Ahead', '/staff/fnb']].map(([type, title, value, status, path]) => <article className="shortcut-card" key={title}><header><h3><i className={`shortcut-${type}`} />{title}</h3><span>{status}</span></header><strong>{value}</strong><small>Reporting: 6 / 6 Properties Active</small><button type="button" onClick={() => onNavigate(path)}>View {title} &nbsp;→</button></article>)}</section>

            <section className="health-card"><header><h3><i />Property Reporting Status</h3><div><span className={partialHealth ? 'degraded' : ''}>● &nbsp;{partialHealth ? '5 / 6 Properties Reporting (1 Degraded)' : '6 / 6 Properties Reporting'}</span><button type="button" onClick={() => setPartialHealth((value) => !value)}>{partialHealth ? '(Restore All Reporting)' : '(Simulate Partial Data)'}</button></div></header><div className="health-grid">{healthProperties.map((property, index) => <div className={partialHealth && index === 5 ? 'degraded' : ''} key={property}><span>● &nbsp; Meridian {property} Resort</span><small>{partialHealth && index === 5 ? 'Data unavailable' : `09:${String(8 + index).padStart(2, '0')} AM`}</small></div>)}</div></section>
          </div>}
        </main>
      </div>
    </div>
  </div>
}

export default OperationsDashboard