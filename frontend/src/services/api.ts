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

export interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

export interface ChatReservationResult {
  reservation_id: string
  guest_id: string
  guest_name: string
  property_name: string
  check_in: string
  check_out: string
  status: string
  room_type: string | null
  special_preference: string | null
}

export interface ChatResponse {
  reply: string
  reservation: ChatReservationResult | null
}

export async function sendChatMessage(message: string, history: ChatMessage[] = []) {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.detail || `Chat request failed: ${response.status}`)
  }
  return response.json() as Promise<ChatResponse>
}
