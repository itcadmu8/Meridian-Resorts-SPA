import { useState } from 'react'

import { useOrders } from '../../hooks/useOrders'

const FNB_STYLES = `
@import url("https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap");

.fnb-operations,
.fnb-operations * {
	box-sizing: border-box;
	letter-spacing: 0;
}

.fnb-operations {
	--fnb-ink: #17352f;
	--fnb-muted: #68766d;
	--fnb-line: #d9ddd1;
	--fnb-paper: #fffdf7;
	--fnb-canvas: #f4f1e6;
	--fnb-moss: #0d6256;
	--fnb-gold: #c88d2c;
	--fnb-coral: #bd583f;
	--fnb-pale-gold: #f5ead1;
	min-height: 100vh;
	padding: 28px;
	color: var(--fnb-ink);
	background-color: var(--fnb-canvas);
	background-image: repeating-linear-gradient(
		0deg,
		transparent 0,
		transparent 35px,
		rgba(23, 53, 47, 0.035) 36px
	);
	font-family: Manrope, "Avenir Next", sans-serif;
	font-size: 15px;
	line-height: 1.45;
	text-align: left;
}

.fnb-shell {
	max-width: 1180px;
	margin: 0 auto;
}

.fnb-topline,
.fnb-heading-row,
.fnb-section-heading,
.fnb-pagination,
.fnb-order-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
}

.fnb-topline {
	min-height: 36px;
	padding-bottom: 18px;
	border-bottom: 1px solid var(--fnb-line);
}

.fnb-identity,
.fnb-kicker,
.fnb-label,
.fnb-column-label,
.fnb-count,
.fnb-service-time {
	margin: 0;
	color: var(--fnb-muted);
	font-family: "DM Mono", monospace;
	font-size: 11px;
	font-weight: 500;
	line-height: 1.35;
	text-transform: uppercase;
}

.fnb-identity {
	color: var(--fnb-ink);
}

.fnb-live-status {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	color: var(--fnb-moss);
	font-size: 12px;
	font-weight: 700;
}

.fnb-live-status::before {
	width: 7px;
	height: 7px;
	border-radius: 50%;
	background: var(--fnb-moss);
	content: "";
}

.fnb-heading-row {
	align-items: end;
	padding: 38px 0 28px;
}

.fnb-kicker {
	margin-bottom: 7px;
	color: var(--fnb-gold);
}

.fnb-title {
	max-width: 700px;
	margin: 0;
	color: var(--fnb-ink);
	font-family: Manrope, "Avenir Next", sans-serif;
	font-size: 34px;
	font-weight: 800;
	line-height: 1.1;
}

.fnb-date-caption {
	margin: 8px 0 0;
	color: var(--fnb-muted);
	font-size: 14px;
}

.fnb-button {
	min-height: 40px;
	padding: 0 15px;
	border: 1px solid var(--fnb-ink);
	border-radius: 6px;
	color: var(--fnb-paper);
	background: var(--fnb-ink);
	cursor: pointer;
	font: inherit;
	font-size: 13px;
	font-weight: 700;
	white-space: nowrap;
}

.fnb-button:hover:not(:disabled) {
	color: var(--fnb-ink);
	background: var(--fnb-gold);
}

.fnb-button:focus-visible,
.fnb-filter-field select:focus-visible,
.fnb-filter-field input:focus-visible {
	outline: 3px solid rgba(200, 141, 44, 0.45);
	outline-offset: 2px;
}

.fnb-button:disabled {
	cursor: wait;
	opacity: 0.6;
}

.fnb-filter-band {
	display: grid;
	grid-template-columns: minmax(210px, 1fr) minmax(180px, 0.7fr) auto;
	align-items: end;
	gap: 14px;
	padding: 18px 0;
	border-top: 1px solid var(--fnb-line);
	border-bottom: 1px solid var(--fnb-line);
}

.fnb-filter-field {
	display: grid;
	gap: 7px;
}

.fnb-filter-field label {
	color: var(--fnb-muted);
	font-family: "DM Mono", monospace;
	font-size: 11px;
	font-weight: 500;
	text-transform: uppercase;
}

.fnb-filter-field select,
.fnb-filter-field input {
	width: 100%;
	height: 42px;
	padding: 0 11px;
	border: 1px solid var(--fnb-line);
	border-radius: 5px;
	color: var(--fnb-ink);
	background: var(--fnb-paper);
	font: inherit;
	font-size: 14px;
}

.fnb-filter-field select {
	cursor: pointer;
}

.fnb-filter-summary {
	min-height: 42px;
	display: flex;
	align-items: center;
	color: var(--fnb-muted);
	font-size: 13px;
	white-space: nowrap;
}

.fnb-metrics {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 12px;
	padding: 25px 0 30px;
}

.fnb-stat {
	min-height: 126px;
	padding: 18px;
	border: 1px solid var(--fnb-line);
	border-radius: 6px;
	background: var(--fnb-paper);
}

.fnb-stat:nth-child(2) {
	border-top: 3px solid var(--fnb-moss);
}

.fnb-stat:nth-child(3) {
	border-top: 3px solid var(--fnb-gold);
}

.fnb-stat:nth-child(4) {
	border-top: 3px solid var(--fnb-coral);
}

.fnb-stat-value {
	margin: 17px 0 0;
	color: var(--fnb-ink);
	font-size: 27px;
	font-weight: 800;
	line-height: 1;
}

.fnb-stat-note {
	margin: 8px 0 0;
	color: var(--fnb-muted);
	font-size: 12px;
}

.fnb-performance {
	padding: 24px 0 27px;
	border-top: 1px solid var(--fnb-line);
	border-bottom: 1px solid var(--fnb-line);
}

.fnb-section-heading {
	margin-bottom: 20px;
}

.fnb-section-heading h2 {
	margin: 0;
	color: var(--fnb-ink);
	font-family: Manrope, "Avenir Next", sans-serif;
	font-size: 19px;
	font-weight: 800;
	line-height: 1.2;
}

.fnb-section-heading p {
	margin: 5px 0 0;
	color: var(--fnb-muted);
	font-size: 13px;
}

.fnb-property-list {
	display: grid;
	gap: 14px;
}

.fnb-property-row {
	display: grid;
	grid-template-columns: minmax(150px, 0.75fr) minmax(120px, 2fr) 76px;
	align-items: center;
	gap: 14px;
}

.fnb-property-name {
	overflow: hidden;
	color: var(--fnb-ink);
	font-size: 13px;
	font-weight: 700;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.fnb-bar-track {
	height: 8px;
	overflow: hidden;
	border-radius: 4px;
	background: #e6e6da;
}

.fnb-bar-value {
	height: 100%;
	min-width: 3px;
	border-radius: 4px;
	background: var(--fnb-moss);
}

.fnb-property-metric {
	color: var(--fnb-ink);
	font-family: "DM Mono", monospace;
	font-size: 12px;
	text-align: right;
}

.fnb-orders-section {
	padding: 30px 0 14px;
}

.fnb-order-title {
	align-items: baseline;
}

.fnb-order-title h2 {
	margin: 0;
	color: var(--fnb-ink);
	font-family: Manrope, "Avenir Next", sans-serif;
	font-size: 21px;
	font-weight: 800;
	line-height: 1.2;
}

.fnb-count {
	color: var(--fnb-moss);
}

.fnb-table-wrap {
	margin-top: 17px;
	overflow-x: auto;
	border: 1px solid var(--fnb-line);
	background: var(--fnb-paper);
}

.fnb-table {
	width: 100%;
	min-width: 740px;
	border-collapse: collapse;
}

.fnb-table th {
	padding: 12px 16px;
	border-bottom: 1px solid var(--fnb-line);
	color: var(--fnb-muted);
	background: #faf7ee;
	font-family: "DM Mono", monospace;
	font-size: 10px;
	font-weight: 500;
	text-align: left;
	text-transform: uppercase;
}

.fnb-table td {
	padding: 15px 16px;
	border-bottom: 1px solid #e9e8df;
	color: var(--fnb-ink);
	font-size: 13px;
	vertical-align: top;
}

.fnb-table tbody tr:last-child td {
	border-bottom: 0;
}

.fnb-table tbody tr:hover {
	background: #fcf5e7;
}

.fnb-table-primary {
	display: block;
	max-width: 200px;
	overflow: hidden;
	font-weight: 700;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.fnb-table-secondary {
	display: block;
	max-width: 330px;
	margin-top: 4px;
	overflow: hidden;
	color: var(--fnb-muted);
	font-size: 12px;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.fnb-cover-value,
.fnb-money-value {
	color: var(--fnb-ink);
	font-family: "DM Mono", monospace;
	font-size: 12px;
	font-weight: 500;
	text-align: right;
	white-space: nowrap;
}

.fnb-cover-value {
	color: var(--fnb-moss);
}

.fnb-empty-state,
.fnb-error-state,
.fnb-loading-state {
	display: grid;
	place-items: center;
	min-height: 310px;
	margin: 25px 0 0;
	border: 1px solid var(--fnb-line);
	background: var(--fnb-paper);
	text-align: center;
}

.fnb-empty-state p,
.fnb-error-state p {
	max-width: 390px;
	margin: 8px auto 0;
	color: var(--fnb-muted);
	font-size: 14px;
}

.fnb-error-state {
	border-color: rgba(189, 88, 63, 0.45);
	background: #fff8f4;
}

.fnb-error-state h2 {
	margin: 0;
	color: var(--fnb-coral);
	font-family: Manrope, "Avenir Next", sans-serif;
	font-size: 20px;
}

.fnb-error-state .fnb-button {
	margin-top: 18px;
}

.fnb-skeletons {
	width: min(550px, 85%);
	display: grid;
	gap: 12px;
}

.fnb-skeleton {
	height: 38px;
	border-radius: 5px;
	background: linear-gradient(90deg, #e7e7dc 25%, #f2f0e8 38%, #e7e7dc 63%);
	background-size: 400% 100%;
	animation: fnb-shimmer 1.5s ease infinite;
}

.fnb-skeleton:nth-child(2) {
	width: 78%;
}

.fnb-skeleton:nth-child(3) {
	width: 92%;
}

.fnb-pagination {
	justify-content: end;
	margin-top: 18px;
}

.fnb-page-indicator {
	min-width: 70px;
	color: var(--fnb-muted);
	font-family: "DM Mono", monospace;
	font-size: 11px;
	text-align: center;
}

.fnb-pagination .fnb-button {
	min-height: 34px;
	padding: 0 11px;
	border-color: var(--fnb-line);
	color: var(--fnb-ink);
	background: transparent;
	font-size: 12px;
}

.fnb-pagination .fnb-button:hover:not(:disabled) {
	background: var(--fnb-pale-gold);
}

@keyframes fnb-shimmer {
	0% {
		background-position: 100% 0;
	}
	100% {
		background-position: 0 0;
	}
}

@media (max-width: 760px) {
	.fnb-operations {
		padding: 18px;
	}

	.fnb-heading-row,
	.fnb-section-heading {
		align-items: start;
		flex-direction: column;
	}

	.fnb-heading-row {
		padding: 28px 0 22px;
	}

	.fnb-title {
		font-size: 30px;
	}

	.fnb-filter-band,
	.fnb-metrics {
		grid-template-columns: 1fr;
	}

	.fnb-filter-summary {
		min-height: 0;
	}

	.fnb-metrics {
		gap: 9px;
	}

	.fnb-stat {
		min-height: 105px;
	}

	.fnb-property-row {
		grid-template-columns: minmax(100px, 0.9fr) minmax(70px, 1.5fr) 58px;
		gap: 9px;
	}

	.fnb-property-name {
		font-size: 12px;
	}
}
`

function formatDateForInput(dateValue = new Date()) {
	return dateValue.toISOString().slice(0, 10)
}

function getNumericValue(value) {
	const numericValue = Number(value)
	return Number.isFinite(numericValue) ? numericValue : 0
}

function formatCurrency(value) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	}).format(getNumericValue(value))
}

function formatServiceDate(value) {
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

function formatServiceTime(value) {
	const dateValue = new Date(value)

	if (Number.isNaN(dateValue.valueOf())) {
		return 'Time unavailable'
	}

	return new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		timeZone: 'UTC',
	}).format(dateValue)
}

function getOrderItems(items) {
	if (!Array.isArray(items) || items.length === 0) {
		return 'No item detail'
	}

	return items
		.map((item) => `${getNumericValue(item.qty)} ${item.name ?? 'item'}`)
		.join(', ')
}

function getPropertyRows(orders) {
	const properties = new Map()

	orders.forEach((order) => {
		const property = properties.get(order.property_id) ?? {
			id: order.property_id,
			name: order.property_name ?? 'Unnamed property',
			covers: 0,
			orders: 0,
			revenue: 0,
		}

		property.covers += getNumericValue(order.covers)
		property.orders += 1
		property.revenue += getNumericValue(order.total)
		properties.set(order.property_id, property)
	})

	return [...properties.values()].sort((first, second) => second.covers - first.covers)
}

function getPropertyOptions(propertyRows, selectedProperty) {
	const options = [...propertyRows]

	if (selectedProperty && !options.some((property) => property.id === selectedProperty)) {
		options.push({ id: selectedProperty, name: 'Selected property' })
	}

	return options.sort((first, second) => first.name.localeCompare(second.name))
}

function FnbOperations() {
	const [selectedProperty, setSelectedProperty] = useState('')
	const [selectedDate, setSelectedDate] = useState(formatDateForInput)
	const [page, setPage] = useState(1)
	const { orders, meta, error, isLoading, refresh } = useOrders({
		propertyId: selectedProperty,
		serviceDate: selectedDate,
		page,
	})

	const propertyRows = getPropertyRows(orders)
	const propertyOptions = getPropertyOptions(propertyRows, selectedProperty)
	const totalCovers = orders.reduce((total, order) => total + getNumericValue(order.covers), 0)
	const totalRevenue = orders.reduce((total, order) => total + getNumericValue(order.total), 0)
	const totalOrders = getNumericValue(meta.total) || orders.length
	const averageCheck = orders.length ? totalRevenue / orders.length : 0
	const maxCovers = Math.max(...propertyRows.map((property) => property.covers), 1)
	const totalPages = Math.max(1, Math.ceil(totalOrders / 100))

	function handlePropertyChange(event) {
		setSelectedProperty(event.target.value)
		setPage(1)
	}

	function handleDateChange(event) {
		setSelectedDate(event.target.value)
		setPage(1)
	}

	return (
		<main className="fnb-operations">
			<style>{FNB_STYLES}</style>
			<div className="fnb-shell">
				<header>
					<div className="fnb-topline">
						<p className="fnb-identity">Meridian Resorts &amp; Spa / Operations</p>
						<span className="fnb-live-status">Service ledger</span>
					</div>

					<div className="fnb-heading-row">
						<div>
							<p className="fnb-kicker">Food and beverage</p>
							<h1 className="fnb-title">F&amp;B Operations</h1>
							<p className="fnb-date-caption">Daily covers, order volume, and gross spend</p>
						</div>
						<button className="fnb-button" type="button" onClick={refresh} disabled={isLoading}>
							Refresh data
						</button>
					</div>
				</header>

				<section className="fnb-filter-band" aria-label="F&B order filters">
					<div className="fnb-filter-field">
						<label htmlFor="fnb-property">Property</label>
						<select id="fnb-property" value={selectedProperty} onChange={handlePropertyChange}>
							<option value="">All properties</option>
							{propertyOptions.map((property) => (
								<option key={property.id} value={property.id}>
									{property.name}
								</option>
							))}
						</select>
					</div>

					<div className="fnb-filter-field">
						<label htmlFor="fnb-date">Service date</label>
						<input id="fnb-date" type="date" value={selectedDate} onChange={handleDateChange} />
					</div>

					<p className="fnb-filter-summary" aria-live="polite">
						{isLoading ? 'Refreshing service data' : `${totalOrders} order${totalOrders === 1 ? '' : 's'} found`}
					</p>
				</section>

				{error ? (
					<section className="fnb-error-state" role="alert">
						<div>
							<h2>F&amp;B data could not be loaded</h2>
							<p>{error}</p>
							<button className="fnb-button" type="button" onClick={refresh}>
								Try again
							</button>
						</div>
					</section>
				) : isLoading ? (
					<section className="fnb-loading-state" aria-label="Loading F&B operations" role="status">
						<div className="fnb-skeletons">
							<div className="fnb-skeleton"></div>
							<div className="fnb-skeleton"></div>
							<div className="fnb-skeleton"></div>
						</div>
					</section>
				) : orders.length === 0 ? (
					<section className="fnb-empty-state">
						<div>
							<p className="fnb-kicker">No service activity</p>
							<h2>No orders recorded</h2>
							<p>Try a different property or service date.</p>
						</div>
					</section>
				) : (
					<>
						<section className="fnb-metrics" aria-label="F&B service totals">
							<article className="fnb-stat">
								<p className="fnb-label">Orders</p>
								<p className="fnb-stat-value">{totalOrders}</p>
								<p className="fnb-stat-note">Recorded for {formatServiceDate(selectedDate)}</p>
							</article>
							<article className="fnb-stat">
								<p className="fnb-label">Covers</p>
								<p className="fnb-stat-value">{totalCovers}</p>
								<p className="fnb-stat-note">Cover items in visible orders</p>
							</article>
							<article className="fnb-stat">
								<p className="fnb-label">Gross spend</p>
								<p className="fnb-stat-value">{formatCurrency(totalRevenue)}</p>
								<p className="fnb-stat-note">Visible order value</p>
							</article>
							<article className="fnb-stat">
								<p className="fnb-label">Average check</p>
								<p className="fnb-stat-value">{formatCurrency(averageCheck)}</p>
								<p className="fnb-stat-note">Per visible order</p>
							</article>
						</section>

						<section className="fnb-performance" aria-labelledby="property-performance-heading">
							<div className="fnb-section-heading">
								<div>
									<h2 id="property-performance-heading">Property performance</h2>
									<p>Covers recorded across the current selection</p>
								</div>
								<span className="fnb-count">{propertyRows.length} properties</span>
							</div>

							<div className="fnb-property-list">
								{propertyRows.map((property) => (
									<div className="fnb-property-row" key={property.id}>
										<span className="fnb-property-name" title={property.name}>
											{property.name}
										</span>
										<div className="fnb-bar-track" aria-hidden="true">
											<div
												className="fnb-bar-value"
												style={{ width: `${(property.covers / maxCovers) * 100}%` }}
											></div>
										</div>
										<span className="fnb-property-metric">{property.covers} covers</span>
									</div>
								))}
							</div>
						</section>

						<section className="fnb-orders-section" aria-labelledby="fnb-orders-heading">
							<div className="fnb-order-title">
								<h2 id="fnb-orders-heading">Orders captured</h2>
								<span className="fnb-count">UTC service time</span>
							</div>

							<div className="fnb-table-wrap">
								<table className="fnb-table">
									<thead>
										<tr>
											<th scope="col">Property</th>
											<th scope="col">Order detail</th>
											<th scope="col">Service time</th>
											<th scope="col">Covers</th>
											<th scope="col">Total</th>
										</tr>
									</thead>
									<tbody>
										{orders.map((order) => (
											<tr key={order.id}>
												<td>
													<span className="fnb-table-primary">{order.property_name}</span>
												</td>
												<td>
													<span className="fnb-table-primary">Order {order.id.slice(0, 8)}</span>
													<span className="fnb-table-secondary">{getOrderItems(order.items)}</span>
												</td>
												<td>
													<span className="fnb-service-time">{formatServiceTime(order.placed_at)} UTC</span>
												</td>
												<td className="fnb-cover-value">{getNumericValue(order.covers)}</td>
												<td className="fnb-money-value">{formatCurrency(order.total)}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{totalPages > 1 ? (
								<nav className="fnb-pagination" aria-label="Orders pagination">
									<button
										className="fnb-button"
										type="button"
										disabled={page === 1}
										onClick={() => setPage((currentPage) => currentPage - 1)}
									>
										Previous
									</button>
									<span className="fnb-page-indicator">
										Page {page} of {totalPages}
									</span>
									<button
										className="fnb-button"
										type="button"
										disabled={page === totalPages}
										onClick={() => setPage((currentPage) => currentPage + 1)}
									>
										Next
									</button>
								</nav>
							) : null}
						</section>
					</>
				)}
			</div>
		</main>
	)
}

export default FnbOperations