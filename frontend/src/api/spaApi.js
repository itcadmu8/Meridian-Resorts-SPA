import client from './client'

export async function getTodaysSpaBookings() {
	const response = await client.get('/api/v1/spa-appointments/today')
	return response.data
}