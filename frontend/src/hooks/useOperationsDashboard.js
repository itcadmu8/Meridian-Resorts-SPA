import { useEffect, useState } from 'react'

import { getOperationsOverview } from '../api/dashboardApi'

const initialState = {
	dashboard: null,
	error: null,
	isLoading: true,
}

export function useOperationsDashboard({ date }) {
	const [state, setState] = useState(initialState)
	const [reloadCount, setReloadCount] = useState(0)

	useEffect(() => {
		const controller = new AbortController()
		let isCurrentRequest = true

		async function load() {
			try {
				const dashboard = await getOperationsOverview({ date, signal: controller.signal })
				if (!isCurrentRequest) {
					return
				}
				setState({ dashboard, error: null, isLoading: false })
			} catch (error) {
				if (!isCurrentRequest || error?.name === 'AbortError') {
					return
				}
				setState({
					dashboard: null,
					error: error instanceof Error ? error.message : 'Unable to load operations overview.',
					isLoading: false,
				})
			}
		}

		setState((current) => ({ ...current, isLoading: true, error: null }))
		void load()

		return () => {
			isCurrentRequest = false
			controller.abort()
		}
	}, [date, reloadCount])

	function refresh() {
		setReloadCount((value) => value + 1)
	}

	return {
		...state,
		refresh,
	}
}

export default useOperationsDashboard