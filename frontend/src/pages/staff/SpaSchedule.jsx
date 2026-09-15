import { useSpaAppointments } from '../../hooks/useSpaAppointments'

function formatTime(value) {
	return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(
		new Date(value),
	)
}

export default function SpaSchedule() {
	const { data, loading, error } = useSpaAppointments()

	return (
		<section className="spa-bookings" aria-labelledby="spa-bookings-title">
			<div className="section-heading">
				<div>
					<p className="eyebrow">Operations overview</p>
					<h2 id="spa-bookings-title">Today&apos;s spa bookings</h2>
				</div>
				{data && <span className="booking-count">{data.total_spa_bookings} appointments</span>}
			</div>

			{loading && <p className="state-message">Loading today&apos;s spa bookings...</p>}
			{error && <p className="state-message state-error" role="alert">{error}</p>}
			{!loading && !error && data?.bookings.length === 0 && (
				<p className="state-message">No spa bookings today.</p>
			)}
			{!loading && !error && data?.bookings.length > 0 && (
				<div className="booking-grid">
					{data.bookings.map((booking) => (
						<article className="booking-row" key={booking.id}>
							<time className="booking-time" dateTime={booking.time_slot}>
								{formatTime(booking.time_slot)}
							</time>
							<div>
								<h3>{booking.service}</h3>
								<p>{booking.therapist} <span aria-hidden="true">•</span> {booking.property}</p>
							</div>
						</article>
					))}
				</div>
			)}
		</section>
	)
}