// Operations dashboard data hook, owned by Member 4.
import { useEffect, useState } from 'react'

import { getOperationsDashboard } from '../api/dashboardApi'

const initialState = {
	dashboard: null,
	error: null,
	isLoading: true,
	requestKey: '',
}

export function useOperationsDashboard({ date = '' } = {}) {
	const [state, setState] = useState(initialState)
	const [reloadCount, setReloadCount] = useState(0)
	const requestKey = `${date}:${reloadCount}`

	useEffect(() => {
		const controller = new AbortController()
		let isCurrentRequest = true

		async function loadDashboard() {
			try {
				const dashboard = await getOperationsDashboard({ date }, { signal: controller.signal })

				if (isCurrentRequest) {
					setState({ dashboard, error: null, isLoading: false, requestKey })
				}
			} catch (error) {
				if (error?.name === 'AbortError' || !isCurrentRequest) {
					return
				}

				setState({
					dashboard: null,
					error: error instanceof Error ? error.message : 'Unable to load the operations dashboard.',
					isLoading: false,
					requestKey,
				})
			}
		}

		void loadDashboard()

		return () => {
			isCurrentRequest = false
			controller.abort()
		}
	}, [date, reloadCount, requestKey])

	function refresh() {
		setState((currentState) => ({ ...currentState, error: null, isLoading: true }))
		setReloadCount((currentCount) => currentCount + 1)
	}

	return {
		...state,
		isLoading: state.isLoading || state.requestKey !== requestKey,
		refresh,
	}
}

export default useOperationsDashboard
