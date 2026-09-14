import { useEffect, useState } from 'react'

import { getOrders } from '../api/ordersApi'

export function useOrders(filters) {
	const [state, setState] = useState({ data: null, loading: true, error: null })

	useEffect(() => {
		let active = true
		setState({ data: null, loading: true, error: null })

		getOrders(filters)
			.then((data) => {
				if (active) setState({ data, loading: false, error: null })
			})
			.catch(() => {
				if (active) setState({ data: null, loading: false, error: 'Unable to load F&B orders.' })
			})

		return () => {
			active = false
		}
	}, [filters.date, filters.propertyId])

	return state
}