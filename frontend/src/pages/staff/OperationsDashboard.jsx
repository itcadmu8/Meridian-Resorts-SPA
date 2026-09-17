// Overall Operations Dashboard, owned by Member 4 (Section 8.3): cross-property
// arrivals, spa bookings and F&B covers for a single day.
import { useState } from 'react'

import StitchShell from '../../components/staff/StitchShell'
import { useOperationsDashboard } from '../../hooks/useOperationsDashboard'

const chartColors = ['#176B63', '#28766F', '#3D847D', '#5A958F', '#7EAAA5', '#A9BFBB']

function formatDateForInput(dateValue = new Date()) {
	return dateValue.toISOString().slice(0, 10)
}

function sumField(properties, field) {
	return properties.reduce((total, property) => total + (Number(property[field]) || 0), 0)
}

function OperationsDashboard() {
	const [selectedDate] = useState(formatDateForInput)
	const { dashboard, error, isLoading, refresh } = useOperationsDashboard({ date: selectedDate })
	const properties = dashboard?.properties ?? []
	const totalArrivals = sumField(properties, 'arrivals')
	const totalSpaBookings = sumField(properties, 'spa_bookings')
	const totalFnbCovers = sumField(properties, 'fnb_covers')
	const maxValue = Math.max(1, ...properties.flatMap((p) => [p.arrivals, p.spa_bookings, p.fnb_covers / 10]))

	return (
		<StitchShell
			breadcrumb={<><button type="button" onClick={() => window.location.assign('/staff/dashboard')}>Dashboard</button> <span>&gt;</span> Overview</>}
			title="Operations Dashboard"
			subtitle="A consolidated view of today's operations across all Meridian properties."
			onRefresh={refresh}
			refreshLabel="Refresh Data"
			refreshing={isLoading}
		>
			{error ? (
				<div className="stitch-state error-state">
					{error}
					<button type="button" onClick={refresh}>Retry</button>
				</div>
			) : isLoading ? (
				<div className="stitch-state">Loading operations dashboard...</div>
			) : properties.length === 0 ? (
				<div className="stitch-state">There is no operational data available for this date yet.</div>
			) : (
				<>
					<section className="stitch-kpis">
						<div><span>Today&apos;s Arrivals</span><strong>{totalArrivals}</strong><small>Across all {properties.length} properties</small></div>
						<div><span>Spa Bookings</span><strong>{totalSpaBookings}</strong><small>Across all {properties.length} properties</small></div>
						<div><span>F&amp;B Covers</span><strong>{totalFnbCovers}</strong><small>Across all {properties.length} properties</small></div>
					</section>

					<section className="stitch-panel">
						<div className="panel-heading">
							<h3>Operations by Property</h3>
							<span>Arrivals · Spa Bookings · F&amp;B Covers (/10)</span>
						</div>
						<div className="bars">
							{properties.map((property, index) => (
								<div className="bar-item" key={property.property_id} title={property.property_name}>
									<div style={{ display: 'flex', alignItems: 'end', gap: '3px', height: '140px' }}>
										<i style={{ width: '10px', height: `${(property.arrivals / maxValue) * 100}%`, background: chartColors[0] }} />
										<i style={{ width: '10px', height: `${(property.spa_bookings / maxValue) * 100}%`, background: chartColors[2] }} />
										<i style={{ width: '10px', height: `${(property.fnb_covers / 10 / maxValue) * 100}%`, background: chartColors[4] }} />
									</div>
									<small>{property.property_name.replace('Meridian ', '')}</small>
								</div>
							))}
						</div>
						<p style={{ margin: '10px 0 0', color: '#687371', fontSize: '11px' }}>
							*F&amp;B covers normalized at 1:10 scale for consolidated visual tracking
						</p>
					</section>

					<section className="stitch-kpis">
						<div><span>Today&apos;s Arrivals</span><strong>{totalArrivals} Expected</strong><small>Reporting: {properties.length} Properties Active</small></div>
						<div><span>Spa Bookings</span><strong>{totalSpaBookings} Scheduled</strong><small>Reporting: {properties.length} Properties Active</small></div>
						<div><span>F&amp;B Covers</span><strong>{totalFnbCovers} Confirmed</strong><small>Reporting: {properties.length} Properties Active</small></div>
					</section>
				</>
			)}
		</StitchShell>
	)
}

export default OperationsDashboard
