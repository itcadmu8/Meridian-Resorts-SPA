import { useEffect, useMemo, useRef, useState } from 'react'
import { getReservations } from '../services/api.js'

const PAGE_SIZE = 10
const chartColors = ['#176B63', '#28766F', '#3D847D', '#5A958F', '#7EAAA5', '#A9BFBB']

function initials(name = '') {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function toDateInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function shiftDate(value, days) {
  const date = new Date(`${value}T00:00:00`)
  date.setDate(date.getDate() + days)
  return toDateInputValue(date)
}

function downloadCsv(rows) {
  const header = ['Reservation ID', 'Guest Name', 'Property', 'Members', 'Check-in', 'Check-out', 'Loyalty', 'Status']
  const csv = [header, ...rows.map((row) => [row.id, row.guest_name, row.property_name, (row.adults || 1) + (row.children || 0), row.check_in, row.check_out, row.loyalty_tier, row.status])]
    .map((line) => line.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  link.download = 'meridian-arrivals.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}

function Reservations({ onBack }) {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [propertyFilter, setPropertyFilter] = useState('All Properties')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [updatedAt, setUpdatedAt] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(() => toDateInputValue(new Date()))
  const dateInputRef = useRef(null)

  const setSelectedArrivalDate = (date) => {
    setSelectedDate(date)
    setPage(1)
  }

  const showPreviousDay = () => {
    setSelectedArrivalDate(shiftDate(selectedDate, -1))
  }

  const showNextDay = () => {
    setSelectedArrivalDate(shiftDate(selectedDate, 1))
  }

  const showToday = () => {
    setSelectedArrivalDate(toDateInputValue(new Date()))
  }

  const loadReservations = async () => {
    try {
      setLoading(true)
      setError('')
      setReservations(await getReservations({ date_from: selectedDate, date_to: selectedDate }))
      setUpdatedAt(new Date())
    } catch {
      setError('Unable to load arrivals. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReservations()
  }, [selectedDate])

  const propertyOptions = useMemo(() => ['All Properties', ...new Set(reservations.map((row) => row.property_name))], [reservations])
  const filteredReservations = useMemo(() => reservations.filter((row) => {
    const query = searchTerm.trim().toLowerCase()
    return (propertyFilter === 'All Properties' || row.property_name === propertyFilter)
      && (!query || row.guest_name?.toLowerCase().includes(query) || row.id.toLowerCase().includes(query))
  }), [reservations, propertyFilter, searchTerm])
  const totalArrivingGuests = useMemo(() => {
    return reservations.reduce((sum, row) => sum + (row.adults || 1) + (row.children || 0), 0)
  }, [reservations])

  const propertyCounts = useMemo(() => {
    const counts = new Map()
    reservations.forEach((row) => counts.set(row.property_name, (counts.get(row.property_name) || 0) + 1))
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [reservations])

  const propertyMemberCounts = useMemo(() => {
    const counts = new Map()
    reservations.forEach((row) => {
      const members = (row.adults || 1) + (row.children || 0)
      counts.set(row.property_name, (counts.get(row.property_name) || 0) + members)
    })
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [reservations])

  const totalPages = Math.max(1, Math.ceil(filteredReservations.length / PAGE_SIZE))
  const visibleRows = filteredReservations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const maxCount = Math.max(1, ...propertyMemberCounts.map(([, count]) => count))
  const updatedTime = updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="stitch-shell">
      <aside className="stitch-sidebar">
        <div>
          <div className="stitch-brand"><span className="stitch-brand-mark">≈</span><div><strong>MERIDIAN</strong><small>RESORTS &amp; SPA</small></div></div>
          <nav className="stitch-nav" aria-label="Main navigation">
            <button type="button" onClick={onBack}>⌂ <span>Dashboard</span></button>
            <button type="button" className="active">▣ <span>Arrivals</span></button>
            <button type="button">♨ <span>Spa Bookings</span></button>
            <button type="button">♜ <span>Properties</span></button>
            <button type="button">▤ <span>Reports</span></button>
          </nav>
        </div>
        <div className="stitch-sidebar-status"><span className="status-dot" /> Ops Network Active <code>v2.4.8</code></div>
      </aside>

      <main className="stitch-main">
        <header className="stitch-hero"><div><h1>Good Morning, Operations Team</h1><p>Here&apos;s what&apos;s happening across our resorts today.</p></div><div className="stitch-user"><span>OM</span><strong>Operations Manager</strong></div></header>
        <div className="stitch-content">
          <div className="stitch-breadcrumb"><button type="button" onClick={onBack}>Dashboard</button> <span>›</span> Arrivals</div>
          <div className="stitch-title-row"><div><h2>Arrivals</h2><p>Review guest arrivals across all properties for the selected date.</p></div><div className="arrival-date-nav"><button type="button" onClick={showPreviousDay} aria-label="Show previous date">‹ Previous</button><label className="date-selector">Date <button type="button" className="date-picker-button" onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()}>{formatDate(selectedDate)}</button><input ref={dateInputRef} className="date-picker-input" type="date" value={selectedDate} onChange={(event) => setSelectedArrivalDate(event.target.value)} aria-label="Select arrival date" /></label><button type="button" onClick={showToday}>Today</button><button type="button" onClick={showNextDay} aria-label="Show upcoming date">Next ›</button><button type="button" className="stitch-refresh" onClick={loadReservations}>↻ Refresh Data</button></div></div>

          {error && <div className="stitch-state error-state">{error}<button type="button" onClick={loadReservations}>Retry</button></div>}
          {loading ? <div className="stitch-state">Loading arrivals...</div> : (
            <>
              <section className="stitch-kpis">
                <div><span>Total Arriving Guests</span><strong>{totalArrivingGuests}</strong><small>{reservations.length} Reservation{reservations.length !== 1 ? 's' : ''} across all properties</small></div>
                <div><span>Properties Reporting</span><strong>{propertyMemberCounts.length}</strong><small>Active properties today</small></div>
                <div><span>Avg. Guests / Property</span><strong>{propertyMemberCounts.length ? Math.round(totalArrivingGuests / propertyMemberCounts.length) : 0}</strong><small>Today&apos;s average</small></div>
              </section>

              <section className="stitch-chart-grid">
                <div className="stitch-panel"><div className="panel-heading"><h3>Arriving Guests by Property</h3><span>Selected Range</span></div><div className="bars">{propertyMemberCounts.map(([name, count], index) => <div className="bar-item" key={name} title={`${name}: ${count} Guests`}><strong>{count}</strong><i style={{ height: `${(count / maxCount) * 100}%`, background: chartColors[index % chartColors.length] }} /><small>{name.replace('Meridian ', '')}</small></div>)}</div></div>
                <div className="stitch-panel share-panel"><div className="panel-heading"><h3>Share of Today's Arriving Guests</h3><span>{totalArrivingGuests} Total Guests</span></div><div className="donut"><strong>{totalArrivingGuests}</strong><small>GUESTS</small></div><div className="legend">{propertyMemberCounts.map(([name, count], index) => <span key={name}><i style={{ background: chartColors[index % chartColors.length] }} />{name.replace('Meridian ', '')}<b>{count}</b></span>)}</div></div>
              </section>

              <section className="stitch-panel arrivals-panel"><div className="panel-heading"><h3>Arrival Details ({filteredReservations.length})</h3><button type="button" onClick={() => downloadCsv(filteredReservations)}>⇩ Export</button></div><div className="filters"><select value={propertyFilter} onChange={(event) => { setPropertyFilter(event.target.value); setPage(1) }}>{propertyOptions.map((name) => <option key={name}>{name}</option>)}</select><input value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setPage(1) }} placeholder="Search by guest name or reservation ID..." /></div>{filteredReservations.length === 0 ? <div className="stitch-state">No arrivals found for {formatDate(selectedDate)}.</div> : <div className="stitch-table-wrap"><table><thead><tr>{['Reservation ID', 'Guest Name', 'Property', 'Members', 'Check-in Date', 'Check-out Date', 'Loyalty Tier', 'Status'].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{visibleRows.map((row) => <tr key={row.id}><td className="mono">{row.id}</td><td><span className="guest-avatar">{initials(row.guest_name)}</span>{row.guest_name}</td><td>{row.property_name}</td><td><strong>{(row.adults || 1) + (row.children || 0)}</strong> <small>({row.adults || 1}A, {row.children || 0}C)</small></td><td className="mono">{formatDate(row.check_in)}</td><td className="mono">{formatDate(row.check_out)}</td><td className={`tier ${row.loyalty_tier?.toLowerCase()}`}>{row.loyalty_tier}</td><td><span className={`status ${row.status.toLowerCase().replaceAll(' ', '-')}`}>{row.status}</span></td></tr>)}</tbody></table></div>}<div className="stitch-pagination"><span>Updated {updatedTime} · Showing {filteredReservations.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, filteredReservations.length)} of {filteredReservations.length} arrivals</span><div><button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button><strong>{page} / {totalPages}</strong><button type="button" disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button></div></div></section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Reservations
