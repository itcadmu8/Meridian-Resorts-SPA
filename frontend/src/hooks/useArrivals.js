import { useEffect, useState } from 'react'

import { getReservations } from '../api/reservationsApi'

export function useArrivals({ date, propertyId, status } = {}) {
	const [arrivals, setArrivals] = useState([])
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [reloadCount, setReloadCount] = useState(0)

	useEffect(() => {
		const controller = new AbortController()
		let isCurrentRequest = true

		async function load() {
			try {
				setIsLoading(true)
				setError(null)
				const rows = await getReservations(
					{
						dateFrom: date,
						dateTo: date,
						propertyId,
						status,
					},
					{ signal: controller.signal },
				)
				if (isCurrentRequest) {
					setArrivals(rows)
				}
			} catch (loadError) {
				if (!isCurrentRequest || loadError?.name === 'AbortError') {
					return
				}
				setError(loadError instanceof Error ? loadError.message : 'Unable to load arrivals.')
			} finally {
				if (isCurrentRequest) {
					setIsLoading(false)
				}
			}
		}

		void load()

		return () => {
			isCurrentRequest = false
			controller.abort()
		}
	}, [date, propertyId, reloadCount, status])

	return {
		arrivals,
		error,
		isLoading,
		refresh: () => setReloadCount((value) => value + 1),
	}
}

export default useArrivals