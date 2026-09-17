/**
 * @file spaApi.js
 * @description API client service for spa requests and backend communication.
 */
import client from './client'

export async function getTodaysSpaBookings() {
	return client.get('/spa-appointments/today')
}