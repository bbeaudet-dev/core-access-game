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

// TODO: Implement BetterAuth later when we add database
export const auth = {
  // Placeholder for now
}; 