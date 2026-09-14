// Overall Operations Dashboard, owned by Member 4 (Section 8.3): cross-property
// arrivals, spa bookings and F&B covers for a single day.
import { useState } from 'react'

import StaffNav from '../../components/staff/StaffNav'
import { useOperationsDashboard } from '../../hooks/useOperationsDashboard'

const DASHBOARD_STYLES = `
@import url("https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap");

.ops-dashboard,
.ops-dashboard * {
	box-sizing: border-box;
	letter-spacing: 0;
}

.ops-dashboard {
	--ops-ink: #17352f;
	--ops-muted: #68766d;
	--ops-line: #d9ddd1;
	--ops-paper: #fffdf7;
	--ops-canvas: #f4f1e6;
	--ops-moss: #0d6256;
	--ops-gold: #c88d2c;
	--ops-coral: #bd583f;
	min-height: 100vh;
	padding: 28px;
	color: var(--ops-ink);
	background-color: var(--ops-canvas);
	background-image: repeating-linear-gradient(
		0deg,
		transparent 0,
		transparent 35px,
		rgba(23, 53, 47, 0.035) 36px
	);
	font-family: Manrope, "Avenir Next", sans-serif;
	font-size: 15px;
	line-height: 1.45;
}

.ops-shell {
	max-width: 1180px;
	margin: 0 auto;
}

.ops-topline {
	padding-bottom: 18px;
	border-bottom: 1px solid var(--ops-line);
}

.ops-identity {
	margin: 0 0 16px;
	color: var(--ops-muted);
	font-family: "DM Mono", monospace;
	font-size: 11px;
	font-weight: 500;
	text-transform: uppercase;
}

.ops-heading-row {
	display: flex;
	align-items: end;
	justify-content: space-between;
	gap: 16px;
	padding: 32px 0 26px;
	flex-wrap: wrap;
}

.ops-kicker {
	margin: 0 0 7px;
	color: var(--ops-gold);
	font-family: "DM Mono", monospace;
	font-size: 11px;
	font-weight: 500;
	text-transform: uppercase;
}

.ops-title {
	margin: 0;
	font-size: 34px;
	font-weight: 800;
	line-height: 1.1;
}

.ops-caption {
	margin: 8px 0 0;
	color: var(--ops-muted);
	font-size: 14px;
}

.ops-controls {
	display: flex;
	align-items: end;
	gap: 14px;
}

.ops-field {
	display: grid;
	gap: 7px;
}

.ops-field label {
	color: var(--ops-muted);
	font-family: "DM Mono", monospace;
	font-size: 11px;
	font-weight: 500;
	text-transform: uppercase;
}

.ops-field input {
	height: 42px;
	padding: 0 11px;
	border: 1px solid var(--ops-line);
	border-radius: 5px;
	color: var(--ops-ink);
	background: var(--ops-paper);
	font: inherit;
	font-size: 14px;
}

.ops-button {
	height: 42px;
	padding: 0 16px;
	border: 1px solid var(--ops-ink);
	border-radius: 6px;
	color: var(--ops-paper);
	background: var(--ops-ink);
	cursor: pointer;
	font: inherit;
	font-size: 13px;
	font-weight: 700;
}

.ops-button:hover:not(:disabled) {
	color: var(--ops-ink);
	background: var(--ops-gold);
}

.ops-button:disabled {
	cursor: wait;
	opacity: 0.6;
}

.ops-nav-wrap {
	padding: 22px 0;
	border-bottom: 1px solid var(--ops-line);
}

.ops-totals {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 12px;
	padding: 26px 0 30px;
}

.ops-total-card {
	min-height: 118px;
	padding: 18px;
	border: 1px solid var(--ops-line);
	border-radius: 6px;
	background: var(--ops-paper);
}

.ops-total-card:nth-child(1) {
	border-top: 3px solid var(--ops-ink);
}

.ops-total-card:nth-child(2) {
	border-top: 3px solid var(--ops-moss);
}

.ops-total-card:nth-child(3) {
	border-top: 3px solid var(--ops-gold);
}

.ops-total-card:nth-child(4) {
	border-top: 3px solid var(--ops-coral);
}

.ops-total-label {
	margin: 0;
	color: var(--ops-muted);
	font-family: "DM Mono", monospace;
	font-size: 11px;
	font-weight: 500;
	text-transform: uppercase;
}

.ops-total-value {
	margin: 15px 0 0;
	font-size: 27px;
	font-weight: 800;
	line-height: 1;
}

.ops-table-section {
	padding: 8px 0 20px;
}

.ops-section-heading h2 {
	margin: 0 0 5px;
	font-size: 19px;
	font-weight: 800;
}

.ops-section-heading p {
	margin: 0 0 20px;
	color: var(--ops-muted);
	font-size: 13px;
}

.ops-table-wrap {
	overflow-x: auto;
	border: 1px solid var(--ops-line);
	background: var(--ops-paper);
}

.ops-table {
	width: 100%;
	min-width: 640px;
	border-collapse: collapse;
}

.ops-table th {
	padding: 12px 16px;
	border-bottom: 1px solid var(--ops-line);
	color: var(--ops-muted);
	background: #faf7ee;
	font-family: "DM Mono", monospace;
	font-size: 10px;
	font-weight: 500;
	text-align: left;
	text-transform: uppercase;
}

.ops-table td {
	padding: 14px 16px;
	border-bottom: 1px solid #e9e8df;
	font-size: 13px;
	vertical-align: top;
}

.ops-table tbody tr:last-child td {
	border-bottom: 0;
}

.ops-table tbody tr:hover {
	background: #fcf5e7;
}

.ops-metric {
	font-family: "DM Mono", monospace;
	font-size: 12px;
	font-weight: 500;
	text-align: right;
	white-space: nowrap;
}

.ops-property-name {
	font-weight: 700;
}

.ops-empty-state,
.ops-error-state,
.ops-loading-state {
	display: grid;
	place-items: center;
	min-height: 280px;
	margin: 20px 0 0;
	border: 1px solid var(--ops-line);
	background: var(--ops-paper);
	text-align: center;
}

.ops-empty-state p,
.ops-error-state p {
	max-width: 380px;
	margin: 8px auto 0;
	color: var(--ops-muted);
	font-size: 14px;
}

.ops-error-state {
	border-color: rgba(189, 88, 63, 0.45);
	background: #fff8f4;
}

.ops-error-state h2 {
	margin: 0;
	color: var(--ops-coral);
	font-size: 20px;
}

.ops-error-state .ops-button {
	margin-top: 16px;
}

@media (max-width: 760px) {
	.ops-dashboard {
		padding: 18px;
	}

	.ops-heading-row {
		align-items: start;
		flex-direction: column;
	}

	.ops-totals {
		grid-template-columns: 1fr;
	}
}
`

function formatDateForInput(dateValue = new Date()) {
	return dateValue.toISOString().slice(0, 10)
}

function formatDisplayDate(value) {
	const dateValue = new Date(`${value}T12:00:00`)
	if (Number.isNaN(dateValue.valueOf())) {
		return value
	}
	return new Intl.DateTimeFormat('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(dateValue)
}

function sumField(properties, field) {
	return properties.reduce((total, property) => total + (Number(property[field]) || 0), 0)
}

function OperationsDashboard() {
	const [selectedDate, setSelectedDate] = useState(formatDateForInput)
	const { dashboard, error, isLoading, refresh } = useOperationsDashboard({ date: selectedDate })
	const properties = dashboard?.properties ?? []
	const totalArrivals = sumField(properties, 'arrivals')
	const totalSpaBookings = sumField(properties, 'spa_bookings')
	const totalFnbCovers = sumField(properties, 'fnb_covers')

	function handleDateChange(event) {
		setSelectedDate(event.target.value)
	}

	return (
		<main className="ops-dashboard">
			<style>{DASHBOARD_STYLES}</style>
			<div className="ops-shell">
				<header className="ops-topline">
					<p className="ops-identity">Meridian Resorts &amp; Spa / Operations</p>
				</header>

				<div className="ops-nav-wrap">
					<StaffNav />
				</div>

				<div className="ops-heading-row">
					<div>
						<p className="ops-kicker">Cross-property overview</p>
						<h1 className="ops-title">Operations Dashboard</h1>
						<p className="ops-caption">
							Arrivals, spa bookings and F&amp;B covers across all six properties for{' '}
							{formatDisplayDate(selectedDate)}
						</p>
					</div>
					<div className="ops-controls">
						<div className="ops-field">
							<label htmlFor="ops-date">Date</label>
							<input id="ops-date" type="date" value={selectedDate} onChange={handleDateChange} />
						</div>
						<button className="ops-button" type="button" onClick={refresh} disabled={isLoading}>
							Refresh data
						</button>
					</div>
				</div>

				{error ? (
					<div className="ops-error-state">
						<div>
							<h2>Unable to load the dashboard</h2>
							<p>{error}</p>
							<button className="ops-button" type="button" onClick={refresh}>
								Try again
							</button>
						</div>
					</div>
				) : isLoading ? (
					<div className="ops-loading-state">
						<p>Loading operations dashboard&hellip;</p>
					</div>
				) : properties.length === 0 ? (
					<div className="ops-empty-state">
						<div>
							<h2>No properties to show</h2>
							<p>There is no operational data available for this date yet.</p>
						</div>
					</div>
				) : (
					<>
						<section className="ops-totals" aria-label="Chain-wide totals">
							<div className="ops-total-card">
								<p className="ops-total-label">Properties</p>
								<p className="ops-total-value">{properties.length}</p>
							</div>
							<div className="ops-total-card">
								<p className="ops-total-label">Arrivals</p>
								<p className="ops-total-value">{totalArrivals}</p>
							</div>
							<div className="ops-total-card">
								<p className="ops-total-label">Spa bookings</p>
								<p className="ops-total-value">{totalSpaBookings}</p>
							</div>
							<div className="ops-total-card">
								<p className="ops-total-label">F&amp;B covers</p>
								<p className="ops-total-value">{totalFnbCovers}</p>
							</div>
						</section>

						<section className="ops-table-section">
							<div className="ops-section-heading">
								<h2>By property</h2>
								<p>Today&rsquo;s activity across the Meridian portfolio.</p>
							</div>
							<div className="ops-table-wrap">
								<table className="ops-table">
									<thead>
										<tr>
											<th>Property</th>
											<th>Arrivals</th>
											<th>Spa bookings</th>
											<th>F&amp;B covers</th>
										</tr>
									</thead>
									<tbody>
										{properties.map((property) => (
											<tr key={property.property_id}>
												<td className="ops-property-name">{property.property_name}</td>
												<td className="ops-metric">{property.arrivals}</td>
												<td className="ops-metric">{property.spa_bookings}</td>
												<td className="ops-metric">{property.fnb_covers}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</section>
					</>
				)}
			</div>
		</main>
	)
}

export default OperationsDashboard
