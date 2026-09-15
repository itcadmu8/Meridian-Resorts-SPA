import { useEffect, useState } from 'react'
import { getTodaysSpaBookings } from '../api/spaApi'

export function useSpaAppointments() {
	const [state, setState] = useState({ data: null, loading: true, error: null })

	useEffect(() => {
		let active = true

		getTodaysSpaBookings()
			.then((data) => {
				if (active) setState({ data, loading: false, error: null })
			})
			.catch(() => {
				if (active) {
					setState({ data: null, loading: false, error: "Unable to load today's spa bookings." })
				}
			})

		return () => {
			active = false
		}
	}, [])

	return state
}