import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  appVersion: '1.0.0-dev',
  appName: 'Angular Enterprise Starter Kit',
  apiBaseUrl: '/api/v1',
  apiTimeoutMs: 15000,
  logLevel: 'debug',
  enableMockData: true,
  monitoring: {
    enabled: false,
  },
  featureFlags: {
    enableAnalytics: false,
    enableDarkMode: true,
    enableTelemetry: false,
  },
};
