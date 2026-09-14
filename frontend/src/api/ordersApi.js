import client from './client'

export async function getOrders({ date, propertyId } = {}) {
	const response = await client.get('/api/v1/orders', {
		params: {
			...(date ? { date } : {}),
			...(propertyId ? { property_id: propertyId } : {}),
		},
	})
	return response.data
}