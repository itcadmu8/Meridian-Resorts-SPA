import client from './client'

export async function getReservations({ propertyId, status, dateFrom, dateTo } = {}, options = {}) {
	const response = await client.get('/reservations', {
		...options,
		params: {
			property_id: propertyId,
			status,
			date_from: dateFrom,
			date_to: dateTo,
		},
	})
	return Array.isArray(response.data) ? response.data : []
}