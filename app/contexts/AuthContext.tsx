import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Basic user type - we'll expand this later
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Authentication state
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Authentication context interface
interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  completeAuth: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state (check for existing session)
  useEffect(() => {
    // TODO: Check for existing session/token
    // For now, just set loading to false
    setAuthState(prev => ({ ...prev, isLoading: false }));
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch('http://localhost:3001/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthState(prev => ({ ...prev, isLoading: false, user: null }));
        throw new Error(data.error || 'Sign in failed');
      }
      setAuthState({ user: data.user, isLoading: false, isAuthenticated: false });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false, user: null }));
      throw error;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name?: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthState(prev => ({ ...prev, isLoading: false, user: null }));
        throw new Error(data.error || 'Sign up failed');
      }
      setAuthState({ user: data.user, isLoading: false, isAuthenticated: false });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false, user: null }));
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // TODO: Implement actual sign out logic
      console.log('Signing out');
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Complete authentication (called after user presses Continue to Game)
  const completeAuth = () => {
    setAuthState(prev => ({ ...prev, isAuthenticated: true }));
  };

  const value: AuthContextType = {
    ...authState,
    signIn,
    signOut,
    signUp,
    completeAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 