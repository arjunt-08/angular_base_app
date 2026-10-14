import { Injectable, inject } from '@angular/core';
import { ConfigService } from '../config/config.service';

export interface IMonitoringService {
  captureException(error: unknown, context?: Record<string, unknown>): void;
  captureMessage(message: string, level?: 'info' | 'warning' | 'error'): void;
  setUser(userId: string, email?: string): void;
  clearUser(): void;
}

@Injectable({
  providedIn: 'root',
})
export class MonitoringService implements IMonitoringService {
  private readonly config = inject(ConfigService);

  captureException(error: unknown, context?: Record<string, unknown>): void {
    if (!this.config.monitoring.enabled) {
      return;
    }
    // Enterprise integration hook (e.g. Sentry.captureException(error, { extra: context }))
    // Kept generic and non-intrusive until production APM is initialized
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (!this.config.monitoring.enabled) {
      return;
    }
    // Enterprise integration hook (e.g. Sentry.captureMessage(message, level))
  }

  setUser(userId: string, email?: string): void {
    if (!this.config.monitoring.enabled) {
      return;
    }
    // Enterprise integration hook (e.g. Sentry.setUser({ id: userId, email }))
  }

  clearUser(): void {
    if (!this.config.monitoring.enabled) {
      return;
    }
    // Enterprise integration hook (e.g. Sentry.setUser(null))
  }
}
