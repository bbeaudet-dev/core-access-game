import { API_ENDPOINTS, getApiUrl } from './config'

export type AuthUser = {
  id: string
  email: string
  name?: string
}

// API functions
export const authApi = {

  // SIGN IN
  async signin(email: string, password: string): Promise<AuthUser> {
    const response = await fetch(getApiUrl(API_ENDPOINTS.signup), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Signin failed')
    }
    const data = await response.json()
    return data.user
  },

  // SIGN UP
  async signup(email: string, password: string, name?: string): Promise<AuthUser> {
    const response = await fetch(getApiUrl(API_ENDPOINTS.signup), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password, name }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Signup failed')
    }
    const data = await response.json()
    return data.user
  },
}

// TODO: BetterAuth later
export const auth = {
  // Placeholder for now
} 
export default auth 