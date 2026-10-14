export interface Environment {
  production: boolean;
  appVersion: string;
  appName: string;
  apiBaseUrl: string;
  apiTimeoutMs: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableMockData: boolean;
  monitoring: {
    enabled: boolean;
    dsn?: string;
  };
  featureFlags: {
    enableAnalytics: boolean;
    enableDarkMode: boolean;
    enableTelemetry: boolean;
  };
}
