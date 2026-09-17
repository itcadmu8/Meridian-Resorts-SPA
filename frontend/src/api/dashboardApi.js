import client from './client';

export async function fetchOperationsDashboard(date = null) {
  const params = date ? { date } : {};
  const response = await client.get('/api/v1/dashboard/operations', { params });
  return response.data;
}