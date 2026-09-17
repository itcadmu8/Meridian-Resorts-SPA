import { useState } from 'react'

import StitchShell from '../../components/staff/StitchShell'
import { useOrders } from '../../hooks/useOrders'

const chartColors = ['#176B63', '#28766F', '#3D847D', '#5A958F', '#7EAAA5', '#A9BFBB']

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

function FnbOperations() {
	const [selectedDate] = useState(formatDateForInput)
	const { orders, error, isLoading, refresh } = useOrders({
		serviceDate: selectedDate,
		page: 1,
	})

	const propertyRows = getPropertyRows(orders)
	const totalCovers = orders.reduce((total, order) => total + getNumericValue(order.covers), 0)
	const totalRevenue = orders.reduce((total, order) => total + getNumericValue(order.total), 0)
	const averageCovers = propertyRows.length ? Math.round(totalCovers / propertyRows.length) : 0
	const maxCovers = Math.max(1, ...propertyRows.map((property) => property.covers))

	return (
		<StitchShell
			breadcrumb={<><button type="button" onClick={() => window.location.assign('/staff/dashboard')}>Dashboard</button> <span>&gt;</span> Today&apos;s F&amp;B Covers</>}
			title="Today&apos;s F&amp;B Covers"
			subtitle="A consolidated view of today's food & beverage covers across all properties."
			onRefresh={refresh}
			refreshLabel="Refresh Data"
			refreshing={isLoading}
		>
			{error ? (
				<div className="stitch-state error-state">{error}<button type="button" onClick={refresh}>Retry</button></div>
			) : isLoading ? (
				<div className="stitch-state">Loading F&amp;B covers...</div>
			) : orders.length === 0 ? (
				<div className="stitch-state">No orders recorded for this date.</div>
			) : (
				<>
					<section className="stitch-kpis">
						<div><span>Total F&amp;B Covers</span><strong>{totalCovers}</strong><small>Across all {propertyRows.length} properties</small></div>
						<div><span>Properties</span><strong>{propertyRows.length}</strong><small>All resorts reporting</small></div>
						<div><span>Avg. Covers / Property</span><strong>{averageCovers}</strong><small>Today&apos;s average</small></div>
					</section>

					<section className="stitch-chart-grid">
						<div className="stitch-panel">
							<div className="panel-heading"><h3>Property-wise F&amp;B Covers Comparison</h3><span>Covers Today</span></div>
							<div className="bars">
								{propertyRows.map((property, index) => (
									<div className="bar-item" key={property.id} title={`${property.name}: ${property.covers}`}>
										<strong>{property.covers}</strong>
										<i style={{ height: `${(property.covers / maxCovers) * 100}%`, background: chartColors[index % chartColors.length] }} />
										<small>{property.name.replace('Meridian ', '')}</small>
									</div>
								))}
							</div>
						</div>
						<div className="stitch-panel share-panel">
							<div className="panel-heading"><h3>Share of Today&apos;s Covers</h3><span>{totalCovers} Total</span></div>
							<div className="donut"><strong>{totalCovers}</strong><small>COVERS</small></div>
							<div className="legend">
								{propertyRows.map((property, index) => (
									<span key={property.id}>
										<i style={{ background: chartColors[index % chartColors.length] }} />
										{property.name.replace('Meridian ', '')}
										<b>{property.covers}</b>
									</span>
								))}
							</div>
						</div>
					</section>

					<section className="stitch-panel arrivals-panel">
						<div className="panel-heading"><h3>Property Breakdown</h3></div>
						<div className="stitch-table-wrap">
							<table>
								<thead>
									<tr>
										<th>Property</th>
										<th>Today&apos;s Covers</th>
										<th>% of Total</th>
										<th>Orders</th>
										<th>Gross Spend</th>
									</tr>
								</thead>
								<tbody>
									{propertyRows.map((property) => (
										<tr key={property.id}>
											<td>{property.name}</td>
											<td className="mono">{property.covers}</td>
											<td className="mono">{totalCovers ? Math.round((property.covers / totalCovers) * 100) : 0}%</td>
											<td className="mono">{property.orders}</td>
											<td className="mono">{formatCurrency(property.revenue)}</td>
										</tr>
									))}
									<tr>
										<td><strong>Total ({propertyRows.length} Properties)</strong></td>
										<td className="mono"><strong>{totalCovers}</strong></td>
										<td className="mono"><strong>100%</strong></td>
										<td className="mono"><strong>{orders.length}</strong></td>
										<td className="mono"><strong>{formatCurrency(totalRevenue)}</strong></td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>
				</>
			)}
		</StitchShell>
	)
}

export default FnbOperations

