// Operations dashboard API, owned by Member 4 (Section 8.2).
import client from './client'

export async function getOperationsDashboard({ date } = {}, { signal } = {}) {
	const response = await client.get('/dashboard/operations', { params: { date }, signal })
	const payload = response?.data ?? response

	if (!payload || payload.success !== true) {
		throw new Error(payload?.message ?? 'Unable to retrieve the operations dashboard.')
	}

	return payload.data
}
