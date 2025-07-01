// API Configuration
export const API_CONFIG = {
  // Development (local)
  development: {
    baseURL: 'https://core-access-api.onrender.com', // Use deployed API for now
  },
  // Production (Render)
  production: {
    baseURL: 'https://core-access-api.onrender.com',
  },
};

// Get the current environment
const isProduction = process.env.NODE_ENV === 'production';

// Export the current config
export const currentConfig = isProduction ? API_CONFIG.production : API_CONFIG.development;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${currentConfig.baseURL}${endpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  health: '/health',
  signin: '/api/auth/signin',
  signup: '/api/auth/signup',
} as const;

// Default export to satisfy Expo Router
export default API_ENDPOINTS; 