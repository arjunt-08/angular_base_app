import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  appVersion: '1.0.0',
  appName: 'Angular Enterprise Starter Kit',
  apiBaseUrl: 'https://api.enterprise-app.com/v1',
  apiTimeoutMs: 15000,
  logLevel: 'warn',
  enableMockData: false,
  monitoring: {
    enabled: true,
    dsn: 'https://example-dsn@sentry.io/project-id',
  },
  featureFlags: {
    enableAnalytics: true,
    enableDarkMode: true,
    enableTelemetry: true,
  },
};
