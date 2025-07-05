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
    const url = getApiUrl(API_ENDPOINTS.signin);
    console.log('Attempting signin to:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Signin response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Signin error response:', error);
        throw new Error(error.error || 'Signin failed');
      }

      const data = await response.json();
      console.log('Signin success:', data);
      return data.user;
    } catch (error) {
      console.error('Signin network error:', error);
      throw error;
    }
  },

  async signup(email: string, password: string, name?: string): Promise<AuthUser> {
    const url = getApiUrl(API_ENDPOINTS.signup);
    console.log('Attempting signup to:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      console.log('Signup response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Signup error response:', error);
        throw new Error(error.error || 'Signup failed');
      }

      const data = await response.json();
      console.log('Signup success:', data);
      return data.user;
    } catch (error) {
      console.error('Signup network error:', error);
      throw error;
    }
  },

  async checkHealth(): Promise<boolean> {
    const url = getApiUrl(API_ENDPOINTS.health);
    console.log('Checking API health at:', url);
    
    try {
      const response = await fetch(url);
      console.log('Health check response status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Health check error:', error);
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