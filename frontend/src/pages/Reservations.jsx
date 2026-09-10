import { useEffect, useMemo, useState } from 'react'
import { getReservations } from '../services/api.js'

const fallbackReservations = [
  {
    id: '101',
    guest_name: 'John Smith',
    property_name: 'Beach Resort A',
    check_in: '2026-09-09',
    check_out: '2026-09-12',
    loyalty_tier: 'Gold',
    status: 'Confirmed',
  },
  {
    id: '102',
    guest_name: 'Priya Kumar',
    property_name: 'Mountain Resort B',
    check_in: '2026-09-09',
    check_out: '2026-09-11',
    loyalty_tier: 'Platinum',
    status: 'Confirmed',
  },
  {
    id: '103',
    guest_name: 'Michael Chen',
    property_name: 'Beach Resort A',
    check_in: '2026-09-09',
    check_out: '2026-09-14',
    loyalty_tier: 'Gold',
    status: 'Confirmed',
  },
  {
    id: '104',
    guest_name: 'Isabella Rossi',
    property_name: 'Mountain Resort C',
    check_in: '2026-09-09',
    check_out: '2026-09-13',
    loyalty_tier: 'Silver',
    status: 'Confirmed',
  },
  {
    id: '105',
    guest_name: 'David Wilson',
    property_name: 'Beach Resort E',
    check_in: '2026-09-09',
    check_out: '2026-09-15',
    loyalty_tier: 'Silver',
    status: 'Confirmed',
  },
  {
    id: '106',
    guest_name: 'Emma Garcia',
    property_name: 'Mountain Resort D',
    check_in: '2026-09-09',
    check_out: '2026-09-11',
    loyalty_tier: 'Platinum',
    status: 'Confirmed',
  },
  {
    id: '107',
    guest_name: 'Hiro Tanaka',
    property_name: 'Beach Resort B',
    check_in: '2026-09-09',
    check_out: '2026-09-10',
    loyalty_tier: 'Gold',
    status: 'Checked In',
  },
  {
    id: '108',
    guest_name: 'Sophia Lee',
    property_name: 'Mountain Resort F',
    check_in: '2026-09-09',
    check_out: '2026-09-12',
    loyalty_tier: 'Silver',
    status: 'Confirmed',
  },
  {
    id: '109',
    guest_name: 'Daniel Brown',
    property_name: 'Beach Resort E',
    check_in: '2026-09-09',
    check_out: '2026-09-12',
    loyalty_tier: 'Silver',
    status: 'Confirmed',
  },
  {
    id: '110',
    guest_name: 'Olivia Martinez',
    property_name: 'Mountain Resort C',
    check_in: '2026-09-09',
    check_out: '2026-09-13',
    loyalty_tier: 'Platinum',
    status: 'Confirmed',
  },
]

const navItems = [
  { label: 'Dashboard', icon: '⌂', active: false },
  { label: "Today's Arrivals", icon: '☰', active: true },
  { label: 'Spa Bookings', icon: '✦', active: false },
  { label: 'F&B Covers', icon: '▤', active: false },
  { label: 'Reservations', icon: '▣', active: false },
  { label: 'Guests', icon: '◌', active: false },
  { label: 'Properties', icon: '▭', active: false },
  { label: 'Folio / Billing', icon: '☑', active: false },
]

function Reservations({ onBack }) {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [propertyFilter, setPropertyFilter] = useState('All Properties')
  const [searchTerm, setSearchTerm] = useState('')
  const selectedDate = 'Tue, Sep 9, 2026'

  useEffect(() => {
    const loadReservations = async () => {
      try {
        setLoading(true)
        const today = new Date().toISOString().slice(0, 10)
        const response = await getReservations({
          date_from: today,
          date_to: today,
        })

        setReservations(response)
      } catch (err) {
        setReservations(fallbackReservations)
        setError('Using fallback arrivals data because the API is not available yet.')
      } finally {
        setLoading(false)
      }
    }

    loadReservations()
  }, [])

  const propertyOptions = useMemo(() => {
    const names = new Set(reservations.map((row) => row.property_name))
    return ['All Properties', ...Array.from(names)]
  }, [reservations])

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesProperty =
        propertyFilter === 'All Properties' || reservation.property_name === propertyFilter

      const searchValue = searchTerm.trim().toLowerCase()
      const matchesSearch =
        searchValue.length === 0 ||
        reservation.guest_name?.toLowerCase().includes(searchValue) ||
        reservation.id.toString().toLowerCase().includes(searchValue)

      return matchesProperty && matchesSearch
    })
  }, [reservations, propertyFilter, searchTerm])

  const displayRows = filteredReservations.length ? filteredReservations : fallbackReservations

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-mark">✦</div>
          <div className="brand-text">
            <span className="brand-title">MERIDIAN</span>
            <span className="brand-subtitle">RESORTS &amp; SPA</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Sidebar navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`nav-item ${item.active ? 'active' : ''}`}
              onClick={() => item.label === "Today's Arrivals" && onBack && onBack()}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-settings">
          <button type="button" className="nav-item secondary">
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </button>
          <button type="button" className="nav-item secondary">
            <span className="nav-icon">?</span>
            <span>Help</span>
          </button>
        </div>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <div className="hero-copy">
            <span>Six Properties.</span>
            <span>Endless Experiences.</span>
          </div>

          <div className="user-box">
            <button type="button" className="notification-btn" aria-label="Notifications">
              🔔
            </button>
            <div className="avatar-pill">
              <span className="avatar-circle">PS</span>
              <div>
                <strong>Priya Sharma</strong>
                <small>Operations Manager</small>
              </div>
            </div>
          </div>
        </header>

        <main className="workspace-panel">
          <div className="crumb-row">
            <button type="button" className="crumb-link" onClick={onBack}>
              Dashboard
            </button>
            <span> &gt; </span>
            <span className="crumb-current">Today's Arrivals</span>
          </div>

          <div className="page-title-row">
            <div>
              <h1>Today's Arrivals</h1>
              <p>View and manage guest arrivals across all properties.</p>
            </div>
            <div className="date-pill">{selectedDate}</div>
          </div>

          <div className="toolbar">
            <div className="summary-card">
              <div className="summary-icon">👥</div>
              <div>
                <span>Total Arrivals</span>
                <strong>{filteredReservations.length || 0}</strong>
              </div>
            </div>

            <div className="property-box">
              <label>Property</label>
              <select value={propertyFilter} onChange={(event) => setPropertyFilter(event.target.value)}>
                {propertyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-box">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search by guest name or reservation ID..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <section className="table-card">
            <div className="table-header-row">
              <h2>Arrival Details ({filteredReservations.length})</h2>
              <button type="button" className="export-btn">
                Export
              </button>
            </div>

            {loading ? (
              <div className="state-box">Loading arrivals...</div>
            ) : error ? (
              <div className="state-box warning">{error}</div>
            ) : filteredReservations.length === 0 ? (
              <div className="state-box empty">No arrivals found for the selected filters.</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Reservation ID</th>
                      <th>Guest Name</th>
                      <th>Property</th>
                      <th>Check-in Date</th>
                      <th>Check-out Date</th>
                      <th>Loyalty Tier</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayRows.map((reservation) => (
                      <tr key={reservation.id}>
                        <td>{reservation.id}</td>
                        <td>
                          <div className="guest-cell">
                            <span className="avatar-mini">
                              {reservation.guest_name
                                .split(' ')
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join('')}
                            </span>
                            {reservation.guest_name}
                          </div>
                        </td>
                        <td>{reservation.property_name}</td>
                        <td>{reservation.check_in}</td>
                        <td>{reservation.check_out}</td>
                        <td>
                          <span className="tier-pill tier-${reservation.loyalty_tier?.toLowerCase() || 'standard'}">
                            {reservation.loyalty_tier || 'Standard'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill ${reservation.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {reservation.status}
                          </span>
                        </td>
                        <td>
                          <button type="button" className="action-btn">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="table-footer">
              <span>Showing 1 – 10 of 24 arrivals</span>
              <div className="pagination">
                <button type="button" className="page-arrow">‹</button>
                <button type="button" className="page-number active">1</button>
                <button type="button" className="page-number">2</button>
                <button type="button" className="page-number">3</button>
                <button type="button" className="page-number">&gt;</button>
              </div>
            </div>
          </section>
        </main>

        <footer className="app-footer">
          <span>© 2026 Meridian Resorts &amp; Spa. All rights reserved.</span>
          <div className="footer-links">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
            <span>People. Places. Possibilities.</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Reservations
