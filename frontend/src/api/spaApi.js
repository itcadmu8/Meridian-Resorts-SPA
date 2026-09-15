import client from './client'

export async function getTodaysSpaBookings() {
	return client.get('/spa-appointments/today')
}