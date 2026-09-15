import client from './client'

function getApiClient() {
	const apiClient = client

	if (!apiClient || typeof apiClient.get !== 'function') {
		throw new Error('The shared API client has not been configured for F&B Operations.')
	}

	return apiClient
}

function normalizeOrdersPayload(response) {
	const payload = response?.data ?? response

	if (!payload || payload.success !== true) {
		throw new Error(payload?.message ?? 'Unable to retrieve F&B orders.')
	}

	return {
		orders: Array.isArray(payload.data) ? payload.data : [],
		meta: payload.meta ?? {},
	}
}

export async function getOrders(
	{ propertyId, serviceDate, page = 1, pageSize = 100 } = {},
	{ signal } = {},
) {
	const params = { page, page_size: pageSize }

	if (propertyId) {
		params.property_id = propertyId
	}
	if (serviceDate) {
		params.date = serviceDate
	}

	const response = await getApiClient().get('/orders', { params, signal })
	return normalizeOrdersPayload(response)
}
