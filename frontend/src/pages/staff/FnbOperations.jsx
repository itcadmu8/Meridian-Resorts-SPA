import { useEffect, useState } from 'react'
import client from '../../api/client'
import { useOrders } from '../../hooks/useOrders'

function today() {
	return new Date().toISOString().slice(0, 10)
}

function formatCurrency(value) {
	return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value)
}

export default function FnbOperations() {
	const [filters, setFilters] = useState({ date: today(), propertyId: '' })
	const { data, loading, error } = useOrders(filters)
	const [reconciliation, setReconciliation] = useState(null)
	const [reconLoading, setReconLoading] = useState(false)

	useEffect(() => {
		let isMounted = true
		setReconLoading(true)
		client.get(`/orders/reconciliation?date=${filters.date}`)
			.then((resData) => {
				if (isMounted) {
					setReconciliation(resData)
					setReconLoading(false)
				}
			})
			.catch(() => {
				if (isMounted) setReconLoading(false)
			})
		return () => {
			isMounted = false
		}
	}, [filters.date])

	return (
		<section className="spa-bookings" aria-labelledby="fnb-operations-title">
			<div className="section-heading">
				<div>
					<p className="eyebrow">Food and beverage</p>
					<h2 id="fnb-operations-title">F&B operations</h2>
				</div>
				{data && <span className="booking-count">{data.total_covers} covers</span>}
			</div>

			<form className="fnb-filters" onSubmit={(event) => event.preventDefault()}>
				<label>
					Date
					<input
						type="date"
						value={filters.date}
						onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))}
					/>
				</label>
				<label>
					Property ID
					<input
						value={filters.propertyId}
						onChange={(event) => setFilters((current) => ({ ...current, propertyId: event.target.value }))}
						placeholder="All properties"
					/>
				</label>
			</form>

			{/* UiPath Nightly Reconciliation Section */}
			<div className="reconciliation-container" style={{ margin: '1.5rem 0', padding: '1rem', background: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
					<div>
						<h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>🤖 Nightly F&B Reconciliation (UiPath Automation)</h3>
						<p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Compares actual F&B covers vs expected resort occupancy (Flagged if variance &gt; 20%)</p>
					</div>
					{reconciliation && (
						<span style={{ padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, background: reconciliation.total_flagged > 0 ? '#7f1d1d' : '#14532d', color: reconciliation.total_flagged > 0 ? '#fca5a5' : '#86efac' }}>
							{reconciliation.total_flagged > 0 ? `⚠️ ${reconciliation.total_flagged} Flagged` : '✓ All Clear'}
						</span>
					)}
				</div>

				{reconLoading && <p style={{ color: '#94a3b8' }}>Loading reconciliation data...</p>}

				{!reconLoading && reconciliation && reconciliation.items && (
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem', color: '#cbd5e1' }}>
							<thead>
								<tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
									<th style={{ padding: '0.5rem' }}>Property</th>
									<th style={{ padding: '0.5rem' }}>Actual Covers</th>
									<th style={{ padding: '0.5rem' }}>Expected Occupancy</th>
									<th style={{ padding: '0.5rem' }}>Variance</th>
									<th style={{ padding: '0.5rem' }}>Variance %</th>
									<th style={{ padding: '0.5rem' }}>Status</th>
								</tr>
							</thead>
							<tbody>
								{reconciliation.items.map((item) => (
									<tr key={item.property_id} style={{ borderBottom: '1px solid #1e293b', background: item.flagged ? 'rgba(239, 68, 68, 0.1)' : 'transparent' }}>
										<td style={{ padding: '0.5rem', fontWeight: 500 }}>{item.property_name}</td>
										<td style={{ padding: '0.5rem' }}>{item.actual_covers}</td>
										<td style={{ padding: '0.5rem' }}>{item.expected_occupancy}</td>
										<td style={{ padding: '0.5rem' }}>{item.variance > 0 ? `+${item.variance}` : item.variance}</td>
										<td style={{ padding: '0.5rem' }}>{item.variance_percent !== null ? `${item.variance_percent}%` : 'N/A'}</td>
										<td style={{ padding: '0.5rem' }}>
											{item.flagged ? (
												<span style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠️ Flagged (&gt;20%)</span>
											) : (
												<span style={{ color: '#22c55e' }}>Normal</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{loading && <p className="state-message">Loading F&B orders...</p>}
			{error && <p className="state-message state-error" role="alert">{error}</p>}
			{!loading && !error && data?.data.length === 0 && <p className="state-message">No F&B orders found.</p>}
			{!loading && !error && data?.data.length > 0 && (
				<div className="booking-grid">
					{data.data.map((order) => (
						<article className="booking-row" key={order.id}>
							<time className="booking-time" dateTime={order.placed_at}>
								{new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(order.placed_at))}
							</time>
							<div>
								<h3>{order.property_name}</h3>
								<p>{order.covers} covers <span aria-hidden="true">/</span> {formatCurrency(order.total)}</p>
							</div>
						</article>
					))}
				</div>
			)}
		</section>
	)
}