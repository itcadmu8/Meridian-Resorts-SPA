import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
})

export const getReservations = async (params = {}) => {
  const response = await api.get('/api/v1/reservations', { params })
  return response.data
}

export default api
