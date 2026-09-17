/**
 * @file Dashboard.jsx
 * @description Page view component for Dashboard.
 */
const summaryCards = [
  { label: 'Today\'s Arrivals', value: '18', tone: 'primary' },
  { label: 'Spa Bookings', value: '12', tone: 'secondary' },
  { label: 'F&B Covers', value: '96', tone: 'accent' },
]

function Dashboard({ onNavigate }) {
  return (
    <div className="page-shell dashboard-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Operations Dashboard</p>
          <h1>Cross-Property Operations</h1>
        </div>
      </header>

      <section className="summary-grid">
        {summaryCards.map((card) => (
          <div key={card.label} className={`stat-card ${card.tone}`}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </section>

      <section className="dashboard-actions">
        <button type="button" className="primary-button" onClick={() => onNavigate('arrivals')}>
          Today\'s Arrivals
        </button>
      </section>
    </div>
  )
}

export default Dashboard
