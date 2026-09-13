const API_BASE_URL = 'http://localhost:8000'

export interface ApiReservation {
  id: string
  guest_id: string
  property_id: string
  guest_name: string
  property_name: string
  loyalty_tier: string
  check_in: string
  check_out: string
  status: string
  room_number: string | null
  room_type: string | null
  special_preference: string | null
}

export async function getReservations(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString()
  const response = await fetch(`${API_BASE_URL}/api/v1/reservations${query ? `?${query}` : ''}`)
  if (!response.ok) throw new Error(`Reservations request failed: ${response.status}`)
  return response.json() as Promise<ApiReservation[]>
}
