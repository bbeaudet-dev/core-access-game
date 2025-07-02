export const API_CONFIG = {
  development: {baseURL: 'https://localhost:3001'},
  production: {baseURL: 'https://core-access-api.onrender.com'},
}

// Get and export current configuration
const isProduction = process.env.NODE_ENV === 'production'
export const currentConfig = isProduction ? API_CONFIG.production : API_CONFIG.development

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${currentConfig.baseURL}${endpoint}`
}

// Common API endpoints
export const API_ENDPOINTS = {
  signin: '/api/auth/signin',
  signup: '/api/auth/signup',
} as const

// Default export to satisfy Expo Router
export default API_ENDPOINTS 