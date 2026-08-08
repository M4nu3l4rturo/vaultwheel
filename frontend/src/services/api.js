import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Vehicles
export const getVehicles = () => api.get('/api/vehicles')
export const getVehicle = (id) => api.get(`/api/vehicles/${id}`)

// Auth
export const register = (data) => api.post('/api/auth/register', data)
export const login = (data) => api.post('/api/auth/login', data)
export const getMe = () => api.get('/api/auth/me')

// Transactions
export const buyTokens = (data) => api.post('/api/transactions/buy', data)
export const getMyTransactions = () => api.get('/api/transactions/me')

// Holdings
export const getMyHoldings = () => api.get('/api/holdings/me')
