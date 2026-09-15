import { getReservations } from './reservationsApi'
import { getSpaServices } from './spaApi'

export async function getOperationsOverview({ date, signal } = {}) {
	const reservations = await getReservations({ dateFrom: date, dateTo: date }, { signal })

	let spaServices = []
	try {
		spaServices = await getSpaServices({ signal })
	} catch {
		spaServices = []
	}

	const byProperty = new Map()
	reservations.forEach((reservation) => {
		const id = reservation.property_id
		const name = reservation.property_name || 'Unknown property'
		const current = byProperty.get(id) || {
			property_id: id,
			property_name: name,
			arrivals: 0,
			spa_bookings: 0,
			fnb_covers: 0,
		}
		current.arrivals += 1
		current.spa_bookings = Math.max(current.spa_bookings, spaServices.length)
		byProperty.set(id, current)
	})

	return {
		date,
		properties: [...byProperty.values()],
	}
}