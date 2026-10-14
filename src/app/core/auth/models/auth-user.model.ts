export type UserRole = 'admin' | 'manager' | 'user' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  avatarUrl?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}
