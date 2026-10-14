import { InjectionToken } from '@angular/core';
import { TokenPair } from '../models/auth-user.model';

export interface ITokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(tokens: TokenPair): void;
  clearTokens(): void;
}

export const TOKEN_STORAGE = new InjectionToken<ITokenStorage>('TOKEN_STORAGE');
