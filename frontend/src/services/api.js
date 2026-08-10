import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-2b47-8000.prg1.zerops.app'

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

// Payments
export const depositFunds = (data) => api.post('/api/payments/deposit', data)

// Market
export const createListing = (data) => api.post('/api/market/list', data)
export const getActiveListings = () => api.get('/api/market')
export const getMyListings = () => api.get('/api/market/my-listings')
export const cancelListing = (listingId) => api.delete(`/api/market/${listingId}`)
export const buyListing = (listingId) => api.post(`/api/market/buy/${listingId}`)
