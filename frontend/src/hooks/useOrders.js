import { useEffect, useState } from 'react'

import { getOrders } from '../api/ordersApi'

const initialState = {
	orders: [],
	meta: {},
	error: null,
	isLoading: true,
	requestKey: '',
}

export function useOrders({ propertyId = '', serviceDate = '', page = 1, pageSize = 100 } = {}) {
	const [state, setState] = useState(initialState)
	const [reloadCount, setReloadCount] = useState(0)
	const requestKey = `${propertyId}:${serviceDate}:${page}:${pageSize}`

	useEffect(() => {
		const controller = new AbortController()
		let isCurrentRequest = true

		async function loadOrders() {
			try {
				const { orders, meta } = await getOrders(
					{ propertyId, serviceDate, page, pageSize },
					{ signal: controller.signal },
				)

				if (isCurrentRequest) {
					setState({
						orders,
						meta,
						error: null,
						isLoading: false,
						requestKey,
					})
				}
			} catch (error) {
				if (error?.name === 'AbortError' || !isCurrentRequest) {
					return
				}

				setState({
					orders: [],
					meta: {},
					error: error instanceof Error ? error.message : 'Unable to retrieve F&B orders.',
					isLoading: false,
					requestKey,
				})
			}
		}

		void loadOrders()

		return () => {
			isCurrentRequest = false
			controller.abort()
		}
	}, [page, pageSize, propertyId, reloadCount, requestKey, serviceDate])

	function refresh() {
		setState((currentState) => ({
			...currentState,
			error: null,
			isLoading: true,
		}))
		setReloadCount((currentCount) => currentCount + 1)
	}

	return {
		...state,
		isLoading: state.isLoading || state.requestKey !== requestKey,
		refresh,
	}
}

export default useOrders