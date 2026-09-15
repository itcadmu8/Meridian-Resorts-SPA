import { useEffect, useState } from 'react'

import { getSpaServices } from '../api/spaApi'

export function useSpaAppointments() {
	const [services, setServices] = useState([])
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
				const rows = await getSpaServices({ signal: controller.signal })
				if (isCurrentRequest) {
					setServices(rows)
				}
			} catch (loadError) {
				if (!isCurrentRequest || loadError?.name === 'AbortError') {
					return
				}
				setError(loadError instanceof Error ? loadError.message : 'Unable to load spa data.')
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
	}, [reloadCount])

	return {
		services,
		error,
		isLoading,
		refresh: () => setReloadCount((value) => value + 1),
	}
}

export default useSpaAppointments