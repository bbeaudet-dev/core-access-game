import { API_ENDPOINTS, getApiUrl } from './config';

// Simple auth types for our app
export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

export type AuthSession = {
  user: AuthUser;
  expires: Date;
};

// API functions
export const authApi = {
  async signin(email: string, password: string): Promise<AuthUser> {
    const response = await fetch(getApiUrl(API_ENDPOINTS.signin), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signin failed');
    }

    const data = await response.json();
    return data.user;
  },

  async signup(email: string, password: string, name?: string): Promise<AuthUser> {
    const response = await fetch(getApiUrl(API_ENDPOINTS.signup), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    const data = await response.json();
    return data.user;
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.health));
      return response.ok;
    } catch {
      return false;
    }
  },
};

// TODO: Implement BetterAuth later with database
export const auth = {
  // Placeholder for now
}; 

// Default export to satisfy Expo Router
export default auth; 