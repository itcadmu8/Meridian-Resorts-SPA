/**
 * @file reservationsApi.js
 * @description API client service for reservations requests and backend communication.
 */
import client from './client';

export async function fetchArrivals(params = {}) {
  const response = await client.get('/api/v1/arrivals', { params });
  return response.data;
}

export async function fetchReservations(params = {}) {
  const response = await client.get('/api/v1/reservations', { params });
  return response.data;
}