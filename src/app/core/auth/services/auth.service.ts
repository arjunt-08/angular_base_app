import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole, TokenPair } from '../models/auth-user.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  // Pre-configured default enterprise user for instant starter out-of-the-box exploration
  private readonly defaultEnterpriseUser: User = {
    id: 'usr_enterprise_01',
    email: 'architect@enterprise.org',
    name: 'Enterprise Architect',
    roles: ['admin', 'manager'],
    avatarUrl: '',
  };

  readonly currentUser = signal<User | null>(this.getInitialUser());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly userRoles = computed(() => this.currentUser()?.roles ?? []);

  constructor() {
    // If no access token exists but we have initial user, seed a dev token
    if (this.currentUser() && !this.tokenStorage.getAccessToken()) {
      this.tokenStorage.setTokens({
        accessToken: 'mock_jwt_starter_dev_token',
      });
    }
  }

  hasRole(role: UserRole): boolean {
    return this.userRoles().includes(role);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  login(tokens: TokenPair, user: User): void {
    this.tokenStorage.setTokens(tokens);
    this.currentUser.set(user);
  }

  logout(redirectUrl = '/login'): void {
    this.tokenStorage.clearTokens();
    this.currentUser.set(null);
    this.router.navigate([redirectUrl]);
  }

  private getInitialUser(): User | null {
    // Return default user in starter kit so dashboard is immediately usable
    return this.defaultEnterpriseUser;
  }
}
