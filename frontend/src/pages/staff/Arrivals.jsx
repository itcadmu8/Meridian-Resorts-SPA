import { useEffect, useMemo, useState } from 'react'
import { getReservations } from '../../api/reservationsApi.js'
import StitchShell from '../../components/staff/StitchShell'

const PAGE_SIZE = 10
const chartColors = ['#176B63', '#28766F', '#3D847D', '#5A958F', 'rgb(126, 170, 165)', '#A9BFBB']

function initials(name = '') {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function downloadCsv(rows) {
  const header = ['Reservation ID', 'Guest Name', 'Property', 'Check-in', 'Check-out', 'Loyalty', 'Status']
  const csv = [header, ...rows.map((row) => [row.id, row.guest_name, row.property_name, row.check_in, row.check_out, row.loyalty_tier, row.status])]
    .map((line) => line.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  link.download = 'meridian-arrivals.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}

function Arrivals() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [propertyFilter, setPropertyFilter] = useState('All Properties')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [updatedAt, setUpdatedAt] = useState(new Date())

  const loadReservations = async () => {
    try {
      setLoading(true)
      setError('')
      const today = new Date().toISOString().slice(0, 10)
      setReservations(await getReservations({ dateFrom: today, dateTo: today }))
      setUpdatedAt(new Date())
    } catch {
      setError('Unable to load today\'s arrivals. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    getReservations({ dateFrom: today, dateTo: today })
      .then((rows) => {
        setReservations(rows)
        setUpdatedAt(new Date())
      })
      .catch(() => setError('Unable to load today\'s arrivals. Check that the backend is running.'))
      .finally(() => setLoading(false))
  }, [])

  const propertyOptions = useMemo(() => ['All Properties', ...new Set(reservations.map((row) => row.property_name))], [reservations])
  const filteredReservations = useMemo(() => reservations.filter((row) => {
    const query = searchTerm.trim().toLowerCase()
    return (propertyFilter === 'All Properties' || row.property_name === propertyFilter)
      && (!query || row.guest_name?.toLowerCase().includes(query) || row.id.toLowerCase().includes(query))
  }), [reservations, propertyFilter, searchTerm])
  const propertyCounts = useMemo(() => {
    const counts = new Map()
    reservations.forEach((row) => counts.set(row.property_name, (counts.get(row.property_name) || 0) + 1))
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [reservations])
  const totalPages = Math.max(1, Math.ceil(filteredReservations.length / PAGE_SIZE))
  const visibleRows = filteredReservations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const maxCount = Math.max(1, ...propertyCounts.map(([, count]) => count))
  const updatedTime = updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <StitchShell
      breadcrumb={<><button type="button" onClick={() => window.location.assign('/staff/dashboard')}>Dashboard</button> <span>&gt;</span> Today&apos;s Arrivals</>}
      title="Today&apos;s Arrivals"
      subtitle="A consolidated view of today's guest arrivals across all properties."
      onRefresh={loadReservations}
      refreshLabel="Refresh Data"
      refreshing={loading}
    >
          {error && <div className="stitch-state error-state">{error}<button type="button" onClick={loadReservations}>Retry</button></div>}
          {loading ? <div className="stitch-state">Loading arrivals...</div> : (
            <>
              <section className="stitch-kpis">
                <div><span>Total Arrivals</span><strong>{reservations.length}</strong><small>Across all reporting properties</small></div>
                <div><span>Properties Reporting</span><strong>{propertyCounts.length}</strong><small>Active properties today</small></div>
                <div><span>Avg. Arrivals / Property</span><strong>{propertyCounts.length ? Math.round(reservations.length / propertyCounts.length) : 0}</strong><small>Today&apos;s average</small></div>
              </section>

              <section className="stitch-chart-grid">
                <div className="stitch-panel"><div className="panel-heading"><h3>Arrivals by Property</h3><span>Arrivals Today</span></div><div className="bars">{propertyCounts.map(([name, count], index) => <div className="bar-item" key={name} title={`${name}: ${count}`}><strong>{count}</strong><i style={{ height: `${(count / maxCount) * 100}%`, background: chartColors[index % chartColors.length] }} /><small>{name.replace('Meridian ', '')}</small></div>)}</div></div>
                <div className="stitch-panel share-panel"><div className="panel-heading"><h3>Share of Today&apos;s Arrivals</h3><span>{reservations.length} Total</span></div><div className="donut"><strong>{reservations.length}</strong><small>ARRIVALS</small></div><div className="legend">{propertyCounts.map(([name, count], index) => <span key={name}><i style={{ background: chartColors[index % chartColors.length] }} />{name.replace('Meridian ', '')}<b>{count}</b></span>)}</div></div>
              </section>

              <section className="stitch-panel arrivals-panel"><div className="panel-heading"><h3>Arrival Details ({filteredReservations.length})</h3><button type="button" onClick={() => downloadCsv(filteredReservations)}>Export</button></div><div className="filters"><select value={propertyFilter} onChange={(event) => { setPropertyFilter(event.target.value); setPage(1) }}>{propertyOptions.map((name) => <option key={name}>{name}</option>)}</select><input value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setPage(1) }} placeholder="Search by guest name or reservation ID..." /></div>{filteredReservations.length === 0 ? <div className="stitch-state">No arrivals found for the selected filters.</div> : <div className="stitch-table-wrap"><table><thead><tr>{['Reservation ID', 'Guest Name', 'Property', 'Check-in Date', 'Check-out Date', 'Loyalty Tier', 'Status'].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{visibleRows.map((row) => <tr key={row.id}><td className="mono">{row.id}</td><td><span className="guest-avatar">{initials(row.guest_name)}</span>{row.guest_name}</td><td>{row.property_name}</td><td className="mono">{formatDate(row.check_in)}</td><td className="mono">{formatDate(row.check_out)}</td><td className={`tier ${row.loyalty_tier?.toLowerCase()}`}>{row.loyalty_tier}</td><td><span className={`status ${row.status.toLowerCase().replaceAll(' ', '-')}`}>{row.status}</span></td></tr>)}</tbody></table></div>}<div className="stitch-pagination"><span>Updated {updatedTime} | Showing {filteredReservations.length ? (page - 1) * PAGE_SIZE + 1 : 0}-{Math.min(page * PAGE_SIZE, filteredReservations.length)} of {filteredReservations.length} arrivals</span><div><button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>{'<'}</button><strong>{page} / {totalPages}</strong><button type="button" disabled={page === totalPages} onClick={() => setPage(page + 1)}>{'>'}</button></div></div></section>
            </>
          )}
    </StitchShell>
  )
}

export default Arrivals
