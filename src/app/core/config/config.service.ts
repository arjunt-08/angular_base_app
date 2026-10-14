import { Injectable, inject } from '@angular/core';
import { APP_CONFIG } from './app-config.token';
import { AppConfig } from './app-config.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly config = inject<AppConfig>(APP_CONFIG);

  get isProduction(): boolean {
    return this.config.production;
  }

  get appName(): string {
    return this.config.appName;
  }

  get appVersion(): string {
    return this.config.appVersion;
  }

  get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  get apiTimeoutMs(): number {
    return this.config.apiTimeoutMs;
  }

  get logLevel(): AppConfig['logLevel'] {
    return this.config.logLevel;
  }

  get isMockDataEnabled(): boolean {
    return this.config.enableMockData;
  }

  get monitoring(): AppConfig['monitoring'] {
    return this.config.monitoring;
  }

  isFeatureEnabled(featureName: keyof AppConfig['featureFlags']): boolean {
    return !!this.config.featureFlags[featureName];
  }
}
