import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ITokenStorage } from '../tokens/token-storage.interface';
import { TokenPair } from '../models/auth-user.model';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService implements ITokenStorage {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly accessKey = 'auth_access_token';
  private readonly refreshKey = 'auth_refresh_token';

  // In-memory fallback if localStorage is unavailable
  private memoryAccessToken: string | null = null;
  private memoryRefreshToken: string | null = null;

  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        return localStorage.getItem(this.accessKey);
      } catch {
        return this.memoryAccessToken;
      }
    }
    return this.memoryAccessToken;
  }

  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        return localStorage.getItem(this.refreshKey);
      } catch {
        return this.memoryRefreshToken;
      }
    }
    return this.memoryRefreshToken;
  }

  setTokens(tokens: TokenPair): void {
    this.memoryAccessToken = tokens.accessToken;
    this.memoryRefreshToken = tokens.refreshToken ?? null;

    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.accessKey, tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem(this.refreshKey, tokens.refreshToken);
        } else {
          localStorage.removeItem(this.refreshKey);
        }
      } catch {
        // Fallback in memory is already set
      }
    }
  }

  clearTokens(): void {
    this.memoryAccessToken = null;
    this.memoryRefreshToken = null;

    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(this.accessKey);
        localStorage.removeItem(this.refreshKey);
      } catch {
        // Ignored
      }
    }
  }
}
