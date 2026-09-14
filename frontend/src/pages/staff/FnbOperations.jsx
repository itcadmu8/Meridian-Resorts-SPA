import { useState } from 'react'

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